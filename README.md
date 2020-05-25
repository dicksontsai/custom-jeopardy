# Custom Jeopardy

Build custom Jeopardy games.

The schema is:

```
{
  single: Array<Category>;
  double: Array<Category>;
  final: Category;
}
```

```
interface Category {
  // Name of the category.
  name: string;
  // A comment for the category.
  comment: string;
  // An array of clues.
  clues: Array<Clue>;
}

interface Clue {
  value: number;
  isDailyDouble: boolean;
  text: string;
  // All answers should be placed here, including alternative answers.
  answer: string;
  // hostNote is an optional field to add notes for the host. Players will
  // never see the content here.
  hostNote?: string;
}
```
