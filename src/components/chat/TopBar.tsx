import { Search, Bell, ChevronDown } from "lucide-react";

const TopBar = () => {
  return (
    <header className="h-12 sm:h-14 px-3 sm:px-6 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-xs sm:text-sm">C</span>
          </div>
          <span className="font-semibold text-foreground text-sm sm:text-base hidden xs:block">ChatFlow</span>
        </div>
      </div>

      {/* Desktop Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4 sm:mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages, files, people..."
            className="w-full pl-9 pr-4 py-2 bg-secondary rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile Search Toggle */}
        <button className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors duration-200 group">
          <Search className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        <button className="relative p-1.5 sm:p-2 rounded-lg hover:bg-secondary transition-colors duration-200 group">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:top-1.5 sm:right-1.5 sm:w-2 sm:h-2 bg-primary rounded-full" />
        </button>

        <button className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 pr-2 sm:pr-3 rounded-lg hover:bg-secondary transition-colors duration-200 group">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-muted">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;