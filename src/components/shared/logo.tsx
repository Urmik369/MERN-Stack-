import Link from 'next/link';
import { Shirt } from 'lucide-react';

export default function Logo({ isIconOnly = false, href = '/' }: { isIconOnly?: boolean, href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-primary">
      <div className="p-2 bg-primary text-primary-foreground rounded-full">
        <Shirt className="h-5 w-5" />
      </div>
      {!isIconOnly && (
        <span className="text-xl font-bold font-headline tracking-tight">
          StyleSpace
        </span>
      )}
    </Link>
  );
}
