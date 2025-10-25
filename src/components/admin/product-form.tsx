
'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const productCategories = ['T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Hoodies', 'Footwear', 'Shirts', 'Shorts', 'Trousers', 'Tops', 'Skirts', 'Accessories'] as const;

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  category: z.enum(productCategories),
  stock: z.coerce.number().int().min(0, { message: 'Stock cannot be negative.' }).optional(),
  image: z.object({
    src: z.string().url({ message: 'Please enter a valid image URL.' }),
    alt: z.string().min(1, { message: 'Image alt text is required.' }),
    hint: z.string().optional(),
  }),
  slug: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product: Product | null;
}

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/[\s-]+/g, '-'); // Replace spaces and hyphens with a single hyphen
};

export function ProductForm({ isOpen, setIsOpen, product }: ProductFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: 'T-Shirts',
      stock: 0,
      image: { src: '', alt: '', hint: '' },
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        ...product,
        image: {
            src: product.image.src,
            alt: product.image.alt,
            hint: product.image.hint,
        }
      });
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        category: 'T-Shirts',
        stock: 0,
        image: { src: '', alt: '', hint: '' },
      });
    }
  }, [product, form, isOpen]);

  const onSubmit = async (values: ProductFormValues) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not available.' });
      return;
    }

    const slug = generateSlug(values.name);
    const dataToSave = { ...values, slug, stock: values.stock ?? 0 };

    if (product) {
      // Update existing product
      const productRef = doc(firestore, 'products', product.id);
      updateDoc(productRef, dataToSave)
        .then(() => {
          toast({
            title: 'Product Updated',
            description: `${values.name} has been successfully updated.`,
          });
          setIsOpen(false);
        })
        .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: productRef.path,
            operation: 'update',
            requestResourceData: dataToSave,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    } else {
      // Add new product
      const productsCollectionRef = collection(firestore, 'products');
      addDoc(productsCollectionRef, dataToSave)
        .then(() => {
          toast({
            title: 'Product Added',
            description: `${values.name} has been successfully added.`,
          });
          setIsOpen(false);
        })
        .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: productsCollectionRef.path,
            operation: 'create',
            requestResourceData: dataToSave,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Classic White Tee" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 799" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A detailed description of the product." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {productCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {product && (
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 150" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                  />
                )}
            </div>
            
             <FormField
              control={form.control}
              name="image.src"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="image.alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="A clear description of the image" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image.hint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image AI Hint (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. white t-shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Product'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
