import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface LanguageTableProps {
    languages: ProgrammingLanguage[];
    onSort: (column: string) => void;
    sortBy: string;
    sortOrder: string;
    onEdit: (id: number) => void;
    onDelete: (language: ProgrammingLanguage) => void;
    onSelectLanguage: (id: number) => void;
    selectedLanguages: number[];
    selectAll: boolean;
    onSelectAll: () => void;
  }
  
  const LanguageTable: React.FC<LanguageTableProps> = ({
    languages,
    onSort,
    sortBy,
    sortOrder,
    onEdit,
    onDelete,
    onSelectLanguage,
    selectedLanguages,
    selectAll,
    onSelectAll,
  }) => (
    <Table>
      <TableCaption>A list of programming languages.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox checked={selectAll} onCheckedChange={onSelectAll} />
          </TableHead>
          <TableHead onClick={() => onSort("id")}>
            ID {sortBy === "id" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => onSort("name")}>
            Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => onSort("creator")}>
            Creator {sortBy === "creator" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => onSort("releaseYear")}>
            Release Year {sortBy === "releaseYear" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => onSort("paradigm")}>
            Paradigm {sortBy === "paradigm" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead onClick={() => onSort("popularity")}>
            Popularity (%) {sortBy === "popularity" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {languages.map((language) => (
          <TableRow key={language.id}>
            <TableCell>
              <Checkbox
                checked={selectedLanguages.includes(language.id)}
                onCheckedChange={() => onSelectLanguage(language.id)}
              />
            </TableCell>
            <TableCell>{language.id}</TableCell>
            <TableCell>{language.name}</TableCell>
            <TableCell>{language.creator}</TableCell>
            <TableCell>{language.releaseYear}</TableCell>
            <TableCell>{language.paradigm}</TableCell>
            <TableCell>{language.popularity}</TableCell>
            <TableCell className="text-right">
              <Button className="mr-2" onClick={() => onEdit(language.id)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => onDelete(language)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  