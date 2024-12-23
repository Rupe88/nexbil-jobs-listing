"use client";

import * as React from "react";
import { ChevronsUpDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ListItem } from "./list-item";

interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  heading: string;
}

export const Combobox = ({
  options,
  value,
  onChange,
  heading,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredOptions = React.useMemo(
    () =>
      options.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          className="w-full justify-between"
        >
          {value
            ? options?.find((option) => option.value === value)?.label ||
              "Select option..."
            : "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 min-w-[300px]">
        <Command>
          <div className="w-full px-2 py-1 flex items-center border rounded-md border-gray-100">
            <Search className="mr-2 h-4 w-4 min-w-4" />
            <input
              type="text"
              value={searchTerm}
              placeholder="Search category"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 w-full outline-none text-sm py-1"
            />
          </div>
          <CommandList>
            <CommandGroup heading={heading}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <ListItem
                    key={option.value}
                    category={option}
                    onSelect={() => {
                      onChange(option.value === value ? "" : option.value);
                      setOpen(false);
                      setSearchTerm("");
                    }}
                    isChecked={option.value === value}
                  />
                ))
              ) : (
                <CommandEmpty>No Category Found</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
