# Custom Jeopardy

Build custom Jeopardy games.

## Directions

1. Fork this repo.
1. Copy from `template.json`.
1. Follow this format for your file name: `<name><yyyy><mm><dd>.json`. Example: `dickson20200501.json`.
1. Fill in your clues and answers.
1. Create a pull request. Your commits should automatically trigger a run of
   my validation script.

## Schema

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
  // Optional field to add notes for the host. Players will never see the
  // content here. Useful for adding background info, additional trivia, etc.
  hostNote?: string;
}
```
