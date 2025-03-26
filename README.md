# Reefq - 3D Jewelry Visualization Platform

A modern web platform for jewelry visualization and AR try-on experiences, built with Next.js 14, Three.js, and TypeScript.

## Features

- 🎨 Stunning 3D jewelry visualization
- 👕 AR try-on experience
- 📱 Fully responsive design
- 🚀 Optimized performance
- 🔒 Secure authentication
- 📊 Analytics dashboard

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Rendering**: Three.js with React Three Fiber
- **AR**: WebXR API
- **Authentication**: NextAuth.js
- **Database**: MongoDB Atlas
- **Analytics**: Vercel Analytics

## Prerequisites

- Node.js 18.17 or later
- npm 9.0 or later
- MongoDB Atlas account
- Vercel account (for deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/reefq.git
   cd reefq
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy!

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Performance Optimization

- Images are optimized using Next.js Image component
- 3D models are loaded dynamically
- Code splitting is implemented for all major components
- Static assets are cached with optimal headers
- Bundle analysis is available with `npm run analyze`

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
├── app/             # App router pages and layouts
├── components/      # React components
├── lib/            # Utility functions and shared logic
└── types/          # TypeScript type definitions
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
