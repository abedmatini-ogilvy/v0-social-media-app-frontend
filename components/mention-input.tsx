"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2 } from "lucide-react";
import { searchMentions, type MentionUser } from "@/lib/api-service";
import { getToken } from "@/lib/auth-service";

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  variant?: "textarea" | "input";
  rows?: number;
}

export function MentionInput({
  value,
  onChange,
  placeholder,
  className = "",
  disabled = false,
  autoFocus = false,
  onKeyDown,
  variant = "input",
  rows = 3,
}: MentionInputProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const token = getToken();
    if (!token) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const users = await searchMentions(query, token);
      setSuggestions(users);
      setSelectedIndex(0);
    } catch (error) {
      console.error("Failed to fetch mention suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (mentionQuery && showDropdown) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(mentionQuery);
      }, 300); // 300ms debounce
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [mentionQuery, showDropdown, fetchSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect @ symbol and extract mention query
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    onChange(newValue);

    // Find if we're in a mention context
    const textBeforeCursor = newValue.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      // Check if there's no space after @ (still typing the mention)
      if (!textAfterAt.includes(" ") && !textAfterAt.includes("\n")) {
        setMentionStartIndex(lastAtIndex);
        setMentionQuery(textAfterAt);
        setShowDropdown(true);
        return;
      }
    }

    setShowDropdown(false);
    setMentionQuery("");
    setMentionStartIndex(-1);
  };

  // Insert selected mention
  const insertMention = (user: MentionUser) => {
    if (mentionStartIndex === -1) return;

    const beforeMention = value.slice(0, mentionStartIndex);
    const afterMention = value.slice(
      mentionStartIndex + mentionQuery.length + 1
    ); // +1 for @

    // Use handle if available, otherwise generate from name
    const mentionHandle =
      user.handle || user.name.toLowerCase().replace(/\s+/g, "_");
    const newValue = `${beforeMention}@${mentionHandle} ${afterMention}`;

    onChange(newValue);
    setShowDropdown(false);
    setMentionQuery("");
    setMentionStartIndex(-1);
    setSuggestions([]);

    // Focus back on input and set cursor position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursorPos = beforeMention.length + mentionHandle.length + 2; // +2 for @ and space
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Handle keyboard navigation in dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Escape should always close the dropdown when visible
    if (showDropdown && e.key === "Escape") {
      e.preventDefault();
      setShowDropdown(false);
      setMentionQuery("");
      setMentionStartIndex(-1);
      return;
    }

    // Arrow/Enter/Tab navigation only when there are suggestions
    if (showDropdown && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          return;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          return;
        case "Enter":
          if (suggestions[selectedIndex]) {
            e.preventDefault();
            insertMention(suggestions[selectedIndex]);
            return;
          }
          break;
        case "Tab":
          if (suggestions[selectedIndex]) {
            e.preventDefault();
            insertMention(suggestions[selectedIndex]);
            return;
          }
          break;
      }
    }

    // Pass through to parent handler
    onKeyDown?.(e);
  };

  const baseClassName = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`;

  return (
    <div className="relative w-full flex-1">
      {variant === "textarea" ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`resize-none ${baseClassName}`}
          disabled={disabled}
          autoFocus={autoFocus}
          rows={rows}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={baseClassName}
          disabled={disabled}
          autoFocus={autoFocus}
        />
      )}

      {/* Mention suggestions dropdown */}
      {showDropdown && (mentionQuery || isLoading) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full max-w-xs mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4 px-3">
              <Loader2 className="h-4 w-4 animate-spin text-purple-500 mr-2" />
              <span className="text-sm text-gray-500">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-48 overflow-y-auto">
              {suggestions.map((user, index) => (
                <li
                  key={user.id}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? "bg-purple-50 dark:bg-purple-900/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => insertMention(user)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder-user.jpg"} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium truncate">
                        {user.name}
                      </span>
                      {user.isVerified && (
                        <CheckCircle className="h-3 w-3 text-blue-500 fill-blue-500 shrink-0" />
                      )}
                      {user.role === "official" && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0 text-[10px] px-1 py-0">
                          Official
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 truncate block">
                      @
                      {user.handle ||
                        user.name.toLowerCase().replace(/\s+/g, "_")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : mentionQuery && !isLoading ? (
            <div className="py-4 px-3 text-center">
              <p className="text-sm text-gray-500">No connections found</p>
              <p className="text-xs text-gray-400 mt-1">
                You can only mention your connections
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
