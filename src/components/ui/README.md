# ReefQ UI Component Library

This directory contains reusable UI components for the ReefQ application that follow a consistent design system.

## Design Philosophy

The component library is built with the following principles:

- **Consistency**: All components follow the same design language and use the centralized theme system
- **Accessibility**: Components are built with accessibility in mind
- **Flexibility**: Components can be customized through props and className
- **Composition**: Components can be composed together to create more complex interfaces

## Available Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui';

<Button>Default Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>

<Button size="sm">Small Button</Button>
<Button size="default">Default Size</Button>
<Button size="lg">Large Button</Button>
<Button size="icon">Icon Button</Button>
```

### Card

A card component with header, content, and footer sections.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <p>Card footer</p>
  </CardFooter>
</Card>;
```

### Input

A form input component with error handling.

```tsx
import { Input } from '@/components/ui';

<Input placeholder="Enter your name" />
<Input type="email" placeholder="Enter your email" />
<Input error={true} helperText="This field is required" />
```

### Select

A dropdown select component.

```tsx
import { Select } from "@/components/ui";

<Select
  options={[
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ]}
/>;
```

## Theme System

All components use the centralized theme system defined in `src/lib/theme.ts` and `src/lib/theme-utils.ts`. The theme includes:

- Colors
- Typography
- Spacing
- Breakpoints
- Border radius
- Shadows
- Z-index
- Transitions

## Usage with Tailwind CSS

Components use Tailwind CSS for styling and can be customized using the `className` prop and the `cn` utility function.

```tsx
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

<Button className={cn("custom-class", someCondition && "conditional-class")}>
  Custom Button
</Button>;
```
