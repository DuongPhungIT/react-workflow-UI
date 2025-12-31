# Quick Start Guide

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

## Cấu trúc project

- **components/**: Các component UI có thể tái sử dụng
- **features/**: Các tính năng chính (WorkflowEditor, WorkflowList)
- **store/**: Redux store với Redux Saga
- **utils/**: Utility functions (API, validation, storage)
- **constants/**: Application constants
- **hooks/**: Custom React hooks
- **types/**: TypeScript type definitions

## Sử dụng Redux

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// Trong component
const dispatch = useAppDispatch();
const workflows = useAppSelector((state) => state.workflow.workflows);

// Dispatch action
dispatch({ type: 'workflow/fetchWorkflows' });
```

## Sử dụng Components

```typescript
import { Button, Input, Card, Modal } from '@/components';

<Button variant="primary" size="md">Click me</Button>
<Input label="Email" type="email" />
<Card padding="lg">Content</Card>
```

## Environment Variables

Tạo file `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Build

```bash
# Build cho production
npm run build

# Build thành library
npm run build:lib
```


