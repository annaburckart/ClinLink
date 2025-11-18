# Design Guidelines: Clinician-Researcher Matching Platform

## Design Approach
**System-Based with Professional References**
Drawing from LinkedIn's professional networking patterns and Material Design's information hierarchy principles to create a trustworthy, efficient matching interface that emphasizes clarity and credibility.

## Typography
- **Primary Font**: Inter (Google Fonts) - clean, professional, excellent readability
- **Headings**: Font weights 700 (main) and 600 (sub), sizes from text-3xl to text-5xl
- **Body Text**: Font weight 400, text-base (16px) with text-lg for important descriptions
- **Data/Metrics**: Font weight 600, slightly smaller (text-sm) for match scores and metadata

## Layout System
**Spacing Units**: Consistent use of Tailwind units 4, 6, 8, 12, and 16 for all spacing
- Sections: py-16 or py-20
- Card padding: p-6 or p-8
- Element gaps: gap-4, gap-6, gap-8
- Container max-width: max-w-6xl for main content, max-w-4xl for forms

## Core Components

### Navigation Header
- Fixed top bar with platform logo/name
- User profile section (researcher/clinician toggle if applicable)
- Clean, minimal navigation with "Submit Problem" and "Browse Researchers" links
- Height: h-16, shadow-sm

### Problem Submission Form
- Single-page centered form (max-w-2xl)
- Large textarea (min-h-48) for problem description
- Character count indicator
- Submit button prominently displayed (w-full on mobile, w-auto on desktop)
- Helper text below textarea: "Describe your clinical challenge in detail for better matches"

### Match Results Display
- Grid layout: Single column on mobile, 2 columns on tablet (md:grid-cols-2)
- Each researcher card includes:
  - Match score badge (top-right, bold percentage with colored indicator)
  - Researcher name (text-xl, font-semibold)
  - Institution/affiliation (text-sm, muted)
  - Research areas as pill-style tags (rounded-full, px-3, py-1)
  - Brief bio excerpt (text-sm, 3-line clamp)
  - Contact button (primary CTA)
- Cards: rounded-lg, p-6, border with subtle shadow on hover

### Researcher Profile Cards (Browse View)
- Masonry-style grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Compact cards with:
  - Avatar/initial circle (h-16 w-16)
  - Name and title stacked
  - 3-4 top keywords visible
  - "View Full Profile" link
- Spacing: gap-6

### Match Score Visualization
- Color-coded confidence levels:
  - High match (90%+): Success indicator
  - Good match (70-89%): Primary indicator  
  - Moderate match (50-69%): Secondary indicator
- Score displayed as both percentage and visual bar/ring

### Previous Matches List
- Table layout on desktop, stacked cards on mobile
- Columns: Problem snippet (truncated), Date, Top Match, View Details
- Alternating row backgrounds for readability
- Fixed header on scroll

## Images
**Hero Section**: Yes, include a professional hero image
- Modern medical/research collaboration imagery (researchers collaborating, clinical setting)
- Height: 60vh on desktop, 40vh on mobile
- Overlay with semi-transparent dark gradient for text legibility
- Centered headline: "Connect Clinical Challenges with Research Expertise"
- CTA button with backdrop-blur-md background

**Additional Images**:
- About/How It Works section: Illustration or photo showing the matching process
- Researcher profile pages: Optional headshots/institution photos

## Interaction Patterns
- Instant search/filter for researcher browsing
- Loading states: Skeleton screens for match results (simulate cards while processing)
- Success notifications after problem submission
- Expandable card details (click to see full researcher bio)
- Smooth transitions: transition-all duration-200

## Page Structure

### Home/Landing Page
1. Hero with CTA
2. How It Works (3-step process with icons)
3. Recent Successful Matches (testimonial-style, 2-column)
4. Browse Researchers preview (grid of 6 cards)
5. Final CTA section

### Submit Problem Page
- Centered form layout
- Progress saved indicator
- Example problems for guidance (collapsible section)

### Match Results Page
- Problem summary at top (card with edit option)
- Researcher results grid below
- Filter sidebar on desktop (top filters on mobile)

### Researcher Directory
- Search bar prominent at top
- Filter chips (by specialty, institution)
- Results grid

## Critical Guidelines
- Maintain trust: Professional aesthetic, no playful elements
- Emphasize match quality: Make scores/confidence prominent
- Accessibility: Maintain WCAG AA contrast ratios throughout
- Mobile-first: Forms and cards must work seamlessly on mobile
- No animations except subtle fades and the loading skeleton states