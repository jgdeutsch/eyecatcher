# Google Shopping Eye Catcher

A Next.js 14 application for conducting visual preference research to discover what types of product images get the highest clickthrough rate and conversion in Google Shopping.

## Features

- 🎯 **5-Second Click Test**: Present images to users for quick visual preference capture
- 📊 **Drag-and-Drop Ranking**: Allow users to rank images by preference
- 💾 **Real-time Data Logging**: All interactions saved to Vercel Postgres via Prisma
- 🎨 **Modern UI**: Built with Tailwind CSS for a beautiful, responsive experience
- 📱 **Mobile Friendly**: Responsive design works on all device sizes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres
- **ORM**: Prisma
- **Drag & Drop**: @dnd-kit/core

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Vercel account (for Postgres database)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:

Create a `.env` file in the root directory:

```env
# Database (for development, use any PostgreSQL or the example below)
DATABASE_URL="postgresql://user:password@localhost:5432/eyecatcher?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/eyecatcher?schema=public"

# Admin Dashboard Password
ADMIN_PASSWORD="your-secure-password-here"
```

For production (Neon), get connection strings from your [Neon Console](https://console.neon.tech).

3. **Set up the database**:

```bash
# Push the schema to your database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

4. **Run the development server**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
eyecatcher/
├── app/
│   ├── api/
│   │   ├── topics/route.ts      # GET endpoint for topics from CSV
│   │   └── results/route.ts     # POST endpoint to save game results
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── GameFlow.tsx             # Main game state manager
│   ├── Welcome.tsx              # Welcome screen
│   ├── Instructions.tsx         # Instructions screen
│   ├── ClickTest.tsx            # 5-second click test phase
│   ├── RankTest.tsx             # Drag-and-drop ranking phase
│   └── Thanks.tsx               # Thank you screen
├── lib/
│   └── prisma.ts                # Prisma client singleton
├── prisma/
│   └── schema.prisma            # Database schema
├── public/
│   └── topics.csv               # Topics and images data
└── package.json
```

## How It Works

### Game Flow

1. **Welcome Screen**: User is greeted and introduced to the study
2. **Instructions**: Clear explanation of both test phases
3. **Click Test** (5 seconds per topic):
   - Images are displayed in a randomized grid
   - User clicks images that catch their eye
   - All clicks are logged with timestamps
4. **Ranking Test**:
   - User drag-and-drops images to rank by preference
   - Rankings are saved to database
5. **Repeat** for each topic in the CSV
6. **Thank You**: Completion screen

### Data Collection

The application logs three types of events to the database:

- **LOAD**: When images are displayed (with position)
- **CLICK**: When user clicks/unclicks an image (with value 1/0)
- **RANK**: Final ranking position for each image (1, 2, 3...)

### Customizing Topics

Edit `public/topics.csv` to add your own topics and images:

```csv
topic_name,topic_name_image_url
Your Topic,https://example.com/image1.jpg
Your Topic,https://example.com/image2.jpg
Another Topic,https://example.com/image3.jpg
```

## Database Schema

```prisma
model GameResult {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  userId    String   @index      // Anonymous ID from localStorage
  userName  String   @index      // User's entered name
  eventType String   // "LOAD", "CLICK", "RANK"
  topicName String
  imageUrl  String
  value     Int      // Context-dependent value
}
```

## Viewing Results

### Admin Dashboard (Recommended)

The app includes a built-in admin dashboard for viewing analytics and downloading data:

1. **Access**: Navigate to `/admin` (e.g., `http://localhost:3000/admin` or `https://eyecatcher.vercel.app/admin`)
2. **Login**: Use the admin password (set via `ADMIN_PASSWORD` environment variable)
3. **Features**:
   - Select topics to view analytics
   - See top-performing images by clicks
   - View average rankings
   - Download raw data as CSV (includes user names and cookie IDs)
   - Export data by topic or all topics

### Alternative: Prisma Studio

For database-level access:
```bash
npx prisma studio
```
This opens a web interface at http://localhost:5555 where you can browse, search, and filter all GameResult records.

## Deployment

This app is configured to deploy to Vercel with a Neon PostgreSQL database.

### Quick Deploy

1. **Set up Neon Database**: Get connection strings from [Neon Console](https://console.neon.tech)
2. **Deploy to Vercel**: Import from GitHub at [vercel.com/new](https://vercel.com/new)
3. **Add Environment Variables** in Vercel:
   - `DATABASE_URL` (Neon pooled connection)
   - `DIRECT_URL` (Neon direct connection)
4. **Deploy**: Vercel will automatically build and deploy

📖 **Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

Live at: **https://eyecatcher.vercel.app**

## Viewing Results

You can query the database directly using Prisma Studio:

```bash
npx prisma studio
```

Or connect to your Vercel Postgres database using any SQL client.

## Development Tips

- Users must enter their name on the welcome screen before starting
- A unique anonymous user ID is automatically generated and stored in `localStorage`
- Both the name and anonymous ID are stored with each result
- Images are shuffled randomly for each user
- All data is saved in real-time as events occur
- To view results, run `npx prisma studio` and browse the GameResult table

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

