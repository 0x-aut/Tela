# Implementation Summary: Convex Integration, Collaboration & Authentication

## Overview
This implementation adds comprehensive features for design file management, real-time collaboration, email invitations, and user authentication using Convex, Resend, and Better Auth.

## Features Implemented

### 1. Convex Database Schema (`convex/schema.ts`)
- **designFiles table**: Stores design files with owner info, shapes, collaborators, and shareable links
  - Indexed by owner email and share link for efficient queries
  - Supports up to 3 collaborators per design (owner + 3 = 4 total edit access)
  - Stores all shape data with support for rectangles, circles, triangles, and lines

- **activeCollaborators table**: Tracks real-time presence of users in design files
  - Automatically cleans up inactive users (last seen > 30 seconds ago)
  - Enables multi-user avatar display

### 2. Convex Functions (`convex/designFiles.ts`)
**Mutations:**
- `createDesignFile`: Creates new design file with unique shareable link
- `updateShapes`: Saves all shapes to database (debounced on client)
- `addCollaborator`: Adds collaborator with max 3 limit enforcement
- `markCollaboratorActive`: Updates user presence timestamp
- `cleanupInactiveCollaborators`: Removes stale presence records

**Queries:**
- `getDesignFileByOwner`: Retrieves user's design file by email
- `getDesignFileByShareLink`: Retrieves design file via shareable link
- `getActiveCollaborators`: Gets list of currently active users (seen in last 30s)

### 3. Email Invitation System (`server/api/invite/send.post.ts`)
- Resend API integration for sending collaboration invites
- Sends branded email with design file link
- From address: `Tela Invite <invite@tela.design>`
- Includes share link: `https://tela-delta.vercel.app/design/{shareLink}`

### 4. Share Modal Component (`app/components/Toasts/Share.vue`)
**Features:**
- 3 collaborator invitation slots (enforces 3 max limit)
- Each slot has:
  - Email input field
  - Access level dropdown (Edit/View)
  - Send invite button with loading state
- Button states:
  - Disabled and greyed out after successful send
  - Re-enabled when user types new email in same slot
  - Shows "Sending..." during API call
- Copy link button to copy shareable design URL
- Integration with Convex to save collaborators
- Integration with Resend to send email invitations

### 5. User Profile Display (`app/components/Design/ElementProperties.vue`)
**Current User:**
- Displays first letter of user's name from Better Auth session
- Fallback to email initial if name not available
- Color-coded avatar based on email hash

**Collaborator Display:**
- Shows up to 3 additional active collaborators
- Each with different color based on email
- Stacked avatars with overlap effect
- Shows first letter of collaborator's name
- Updates in real-time as users join/leave
- Tooltip shows full name on hover

**Presence System:**
- Marks user as active every 15 seconds
- Cleanup on component unmount
- Only shows collaborators seen in last 30 seconds

### 6. Design Page Integration (`app/pages/design/[id].vue`)
**On Page Load:**
1. Checks if accessing via share link or as owner
2. Loads existing design file or creates new one
3. Loads all shapes from Convex into local store
4. Generates and navigates to shareable link if new file

**Shape Persistence:**
- Watches shape store for changes
- Debounces saves by 2 seconds to reduce API calls
- Converts all shape types to Convex-compatible format
- Preserves shape-specific properties (line start/end points, etc.)

**Shape Loading:**
- Reconstructs Shape, Circle, Triangle, and Line objects from Convex data
- Maintains all shape properties and rendering data
- Clears local store before loading to avoid duplicates

### 7. Configuration (`nuxt.config.ts`)
Added `resendApiKey` to runtime config for server-side email sending

## Environment Variables Required

Add to your `.env.local` file:
```bash
# Existing variables
CONNECTION_STRING=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
CONVEX_URL=your_convex_deployment_url

# New variable for email invites
RESEND_API_KEY=your_resend_api_key
```

## How It Works

### User Flow - Creating a Design
1. User logs in with Better Auth
2. Navigates to `/design/[id]` route
3. System checks if design file exists for user's email
4. If not, creates new design file with unique share link
5. User's initial appears in profile circle (top right)
6. As user draws shapes, they're auto-saved to Convex every 2 seconds

### User Flow - Inviting Collaborators
1. User clicks "Share" button
2. Modal opens with 3 invitation slots
3. User enters collaborator email
4. Clicks "Send invite" button
5. System:
   - Adds collaborator to Convex (enforces max 3)
   - Sends email via Resend with invite link
   - Disables button and greys it out
6. Button re-enables when user types new email

### User Flow - Joining as Collaborator
1. Collaborator receives email with link
2. Clicks link to design file
3. System loads design by share link
4. Loads all existing shapes
5. Marks collaborator as active
6. Collaborator's avatar appears in owner's view
7. Presence updated every 15 seconds

### User Flow - Copy Link
1. User clicks "Copy link to view" button
2. System copies: `https://tela-delta.vercel.app/design/{shareLink}`
3. Link can be shared directly (bypasses email invite)
4. Anyone with link can access if they have an account

## Technical Details

### Shape Data Structure
All shapes stored in Convex with this base schema:
```typescript
{
  id: string,
  type: 'rectangle' | 'circle' | 'triangle' | 'line',
  coordX: number,
  coordY: number,
  width: number,
  height: number,
  // Line-specific (optional)
  startX?: number,
  startY?: number,
  endX?: number,
  endY?: number,
  thickness?: number
}
```

### Avatar Color Generation
- 6 predefined colors: Orange, Blue, Green, Amber, Purple, Pink
- Hash email string to get consistent color per user
- Ensures same user always has same color
- Different users get different colors

### Debouncing Strategy
- Shape saves debounced by 2 seconds
- Prevents excessive API calls during rapid drawing
- Ensures eventual consistency
- User can refresh page to see latest saved state

### Presence Tracking
- Users marked active every 15 seconds (client-side interval)
- Server filters to users seen in last 30 seconds
- Cleanup removes users inactive for 60+ seconds
- Provides buffer for network delays

## Files Modified/Created

### Created Files:
- `convex/schema.ts` - Database schema
- `convex/designFiles.ts` - Convex queries and mutations
- `server/api/invite/send.post.ts` - Email invitation endpoint

### Modified Files:
- `app/components/Toasts/Share.vue` - Share modal with invite functionality
- `app/components/Design/ElementProperties.vue` - User/collaborator avatars
- `app/pages/design/[id].vue` - Design persistence and loading
- `nuxt.config.ts` - Added Resend API key config

## Testing Checklist

### Authentication
- [ ] User initial displays correctly from Better Auth session
- [ ] Fallback to email initial works if no name

### Shape Persistence
- [ ] Shapes save to Convex after drawing
- [ ] Shapes load from Convex on page refresh
- [ ] All shape types persist correctly (rectangle, circle, triangle, line)
- [ ] Debouncing works (no save spam)

### Collaboration Invites
- [ ] Can send invite to 1st collaborator
- [ ] Can send invite to 2nd collaborator
- [ ] Can send invite to 3rd collaborator
- [ ] Cannot add 4th collaborator (error shown)
- [ ] Button disables after successful send
- [ ] Button re-enables when new email typed
- [ ] Email received with correct link
- [ ] Link works and loads design file

### Real-time Presence
- [ ] Current user avatar shows
- [ ] Collaborator joins and avatar appears
- [ ] Avatar disappears when collaborator leaves
- [ ] Multiple collaborators show correctly
- [ ] Avatar colors are consistent per user

### Share Link
- [ ] Copy link button works
- [ ] Link format correct
- [ ] Link loads design file
- [ ] Non-owner can access via link

## Next Steps (Optional Enhancements)

1. **Real-time Sync**: Add WebSocket support for live collaboration
2. **View-Only Access**: Implement the View permission (currently only Edit exists)
3. **Cursor Tracking**: Show other users' cursors in real-time
4. **Conflict Resolution**: Handle simultaneous edits to same shape
5. **Design History**: Version control for design changes
6. **Remove Collaborators**: Add ability to revoke access
7. **Email Customization**: Rich HTML email templates
8. **Notifications**: Alert when someone joins your design
