import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar({ onSearch }) {
  const handleChange = (e) => {
    const value = e.target.value;
    onSearch(value);
  };

  return (
    <div className="relative flex-grow max-w-xl">
      <Input
        type="search"
        placeholder="Search..."
        className="pl-10 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-none w-full"
        onChange={handleChange}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>
  );
}
