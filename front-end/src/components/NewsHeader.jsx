import React from 'react';
import { Menu, Search, Newspaper } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const NewsHeader = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b border-border sticky top-0 z-10">
      <button 
        onClick={onMenuClick}
        className="p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-full"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="flex items-center gap-2">
        <div className="text-primary">
          <Newspaper className="w-5 h-5 fill-current" />
        </div>
        <h1 className="text-lg font-bold text-foreground">News</h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button className="p-2 -mr-2 text-muted-foreground hover:bg-accent rounded-full bg-accent/50 dark:bg-accent dark:text-foreground dark:hover:bg-accent/80">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default NewsHeader;
