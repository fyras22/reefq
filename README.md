# Reefq - 3D Jewelry Visualization Platform

A modern web platform for jewelry visualization and AR try-on experiences, built with Next.js 14, Three.js, TypeScript, and Supabase.

## Features

- 🎨 Stunning 3D jewelry visualization
- 👕 AR try-on experience
- 📱 Fully responsive design
- 🚀 Optimized performance
- 🔒 Secure authentication (Supabase Auth)
- 💾 Database persistence (Supabase Postgres)
- 📊 Analytics dashboard (Vercel Analytics)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Rendering**: Three.js with React Three Fiber
- **AR**: WebXR API
- **Backend**: Supabase (Authentication, Database)
- **Analytics**: Vercel Analytics

## Prerequisites

- Node.js 18.17 or later
- npm or yarn (check lockfile)
- Supabase account (for Auth and Database)
- Vercel account (for deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables obtained from your Supabase project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional: Needed for certain backend operations if policies require it
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key 
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/reefq.git
   cd reefq
   ```

2. Install dependencies (use `yarn install` if `yarn.lock` exists, otherwise `npm install`):
   ```bash
   # Check for yarn.lock first
   yarn install 
   # OR
   npm install 
   ```

3. Set up environment variables:
   ```bash
   # Create the file
   touch .env.local 
   # Edit .env.local with your Supabase URL and Anon Key
   ```
   **Important:** Also configure the necessary Supabase database tables (e.g., `jewelry_designs`, `customization_settings`) and potentially RLS policies and RPC functions (`increment_view_count`). Set up OAuth providers in your Supabase project dashboard if you intend to use them.

4. Start the development server:
   ```bash
   yarn dev
   # OR
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Scripts

- `yarn dev` / `npm run dev` - Start development server
- `yarn build` / `npm run build` - Build for production
- `yarn start` / `npm run start` - Start production server
- `yarn lint` / `npm run lint` - Run ESLint
- `yarn test` / `npm run test` - Run Jest tests
- `yarn analyze` / `npm run analyze` - Analyze bundle size

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel (matching your `.env.local`)
4. Deploy!

## Performance Optimization

- Images are optimized using Next.js Image component
- 3D models are loaded dynamically
- Code splitting is implemented for all major components
- Static assets are cached with optimal headers
- Bundle analysis is available with `yarn analyze` / `npm run analyze`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@reefq.com or join our Slack channel.

## Project Structure

```
src/
├── app/             # App router pages, layouts, API routes
├── components/      # React components (UI, shared)
├── hooks/           # Custom React hooks (e.g., useCustomization)
├── lib/             # Utility functions, Supabase client helpers
├── providers/       # React Context providers (e.g., AuthProvider)
├── services/        # Business logic, data transformation (e.g., customizationService)
└── types/           # TypeScript type definitions (if any)
public/            # Static assets (images, models)
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
