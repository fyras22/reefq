# Migration Guide: SizeComparisonTool

## Overview

This document outlines the migration from the legacy `SizeComparisonTool` component to the new `SizeComparisonToolNew` component. The new component has been rewritten to leverage the utility functions and data structures from the centralized `src/utils/sizeConversions.ts` file.

## Why Migrate?

The original `SizeComparisonTool` had several issues:
- Duplicated size data within the component rather than using centralized data
- Inconsistent styling compared to the rest of the application
- Hard-coded values that made maintenance difficult
- Some browser compatibility issues

## Changes Made

1. Created a new component `SizeComparisonToolNew.tsx` that:
   - Uses the utility functions and data from `sizeConversions.ts`
   - Follows modern React patterns with TypeScript
   - Uses consistent styling with the application design system
   - Provides better type safety and error handling

2. Updated imports in:
   - `src/components/MeasurementGuide.tsx`
   - `src/app/[lang]/features/measurements/page.tsx`

3. Fixed import extension issues (removing `.jsx` extension)

## Migration Steps for Other Components

If you have any additional components using the old `SizeComparisonTool`, please follow these steps:

1. Update imports from:
   ```typescript
   import SizeComparisonTool from './SizeComparisonTool';
   ```
   
   to:
   ```typescript
   import SizeComparisonTool from './SizeComparisonToolNew';
   ```

2. Ensure you're providing the required props:
   ```tsx
   <SizeComparisonTool jewelryType="ring" />
   ```

   The `jewelryType` prop is required and must be one of: 'ring', 'bracelet', 'necklace', or 'earrings'.

3. Optional props include:
   - `initialSize`: A string or number representing the initial size selection
   - `onSizeChange`: A callback function that receives the updated size when the user makes a selection

## Data Structure Changes

The new component uses the centralized data structures from `sizeConversions.ts`:

- `ringSizes[]`: Array of ring size data with US, UK, EU, and diameter information
- `braceletSizes[]`: Array of bracelet size information
- `necklaceSizes[]`: Array of necklace length data
- `earringSizes[]`: Array of earring size information

If you need to modify size data, please update the `sizeConversions.ts` file rather than the component itself.

## Deprecation Timeline

The original `SizeComparisonTool` component will be deprecated and removed in a future release. Please migrate to the new component as soon as possible.

## Questions or Issues?

If you encounter any issues during migration, please contact the development team. 