# StudyHub Upload System - Quick Testing Guide

**Status:** ✅ Ready to Test  
**Files Modified:** 5 files (3 frontend, 2 backend)  
**Database Changes:** None  

---

## Quick Summary of Changes

### What Was Fixed:
- ❌ Old: Only PDF uploads supported
- ✅ New: PDF + Word (.doc, .docx) uploads supported

### What Changed:
1. **Frontend Validation** - Now accepts PDF, DOC, DOCX
2. **Backend MIME Types** - Now validates PDF, DOC, DOCX  
3. **File Extensions** - Now preserved (was always .pdf)
4. **Error Messages** - Now mention Word files as option

### What Didn't Change:
- Database (still works)
- API endpoints (same routes)
- Auth (still required)
- File storage location (still /uploads)
- UI layout (no redesign)

---

## Testing in 5 Minutes

### Setup:
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend (in new terminal)
cd client
npm run dev

# Open browser: http://localhost:3000
```

### Test 1: Note Upload (PDF)
1. Go to `/study`
2. Click "Upload New Note"
3. Enter: Title = "Test PDF Note"
4. Select: Any course
5. Choose: Any PDF file
6. Click: Upload

**Expected:** ✅ Success message, note appears in list

### Test 2: Question Upload (Word)
1. Go to `/study`
2. Click "Upload Previous Year Question"
3. Enter: Title = "Test Word Question"
4. Select: Any course
5. Choose: Any .docx file
6. Click: Upload

**Expected:** ✅ Success message, question appears in list

### Test 3: Research Upload (Any Format)
1. Go to `/research`
2. Click "Upload Research"
3. Enter: Title = "Test Research"
4. Choose: Any PDF or Word file
5. Click: Upload

**Expected:** ✅ Success message, research appears in list

### Test 4: Error Handling
1. Try to upload a `.txt` file
2. Browser should show: "Only PDF and Word files are allowed"

**Expected:** ❌ Error message appears, upload blocked

### Test 5: File Accessibility
1. After successful upload
2. Download the file by clicking its link
3. Verify file opens correctly

**Expected:** ✅ File downloads with correct extension

---

## Files to Check If Issues Occur

### Frontend Files:
```
client/src/app/study/page.tsx          ← lines 135, 193, 431
client/src/app/research/page.tsx       ← lines 66, 181
client/src/services/study.ts           ← (no changes)
client/src/services/research.ts        ← (no changes)
```

### Backend Files:
```
server/modules/study/study.routes.js   ← lines 17-44
server/modules/research/research.routes.js ← lines 11-38
server/modules/*/study.controller.js   ← (no changes)
server/modules/*/research.controller.js ← (no changes)
```

### Upload Folder:
```
server/uploads/                        ← Check files have correct extensions
```

---

## Supported File Types

### Frontend Accept Attribute:
```typescript
accept=".pdf,.doc,.docx"
```

### Backend MIME Types:
```javascript
const ALLOWED_MIMETYPES = [
  'application/pdf',
  'application/msword',                    // .doc
  'application/vnd.openxmlformats-...'    // .docx
];
```

### File Size Limit:
```
50 MB per file (enforced)
```

---

## What Success Looks Like

### Successful Upload Response:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "title": "My Document",
    "file_url": "/uploads/1712345678-abc123def456.docx",
    "user_id": 1,
    "course_id": 5,
    "created_at": "2026-04-07T12:00:00Z"
  },
  "message": "Note uploaded successfully"
}
```

### Failed Upload Response:
```json
{
  "success": false,
  "message": "Only PDF and Word files (.pdf, .doc, .docx) are allowed"
}
```

---

## Common Issues & Quick Fixes

| Issue | Check | Fix |
|-------|-------|-----|
| "Only PDF files allowed" | Server running latest code | Restart: `npm run dev` |
| File has wrong extension | Uploads folder | File extension should match type |
| Upload button greyed out | Logged in? | Must be authenticated |
| File not appearing in list | Network request | Check browser console |
| Can't see uploaded file | File accessible? | Check /uploads folder |

---

## Debug Mode

### Enable verbose logging:
```bash
# In terminal where backend is running
# Look for:
# - "POST /api/study/notes/upload"
# - "File uploaded: filename.docx"
# - "Error: ..." if something fails
```

### Check uploaded files:
```bash
ls -lah server/uploads/
# Should show files like:
# 1712345678-abc123def.pdf
# 1712345679-def456abc.docx
# 1712345680-ghi789jkl.doc
```

### Test MIME type detection:
```bash
# On Mac:
file -b server/uploads/1712345678-abc123def.docx
# Should output: Microsoft Word 2007+

# On Linux:
file -b --mime-type server/uploads/1712345678-abc123def.docx
# Should output: application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

---

## Rollback (If Needed)

If something goes wrong and you need to revert:

```bash
# Backend - only 2 files changed
git checkout server/modules/study/study.routes.js
git checkout server/modules/research/research.routes.js

# Frontend - only 3 files changed  
git checkout client/src/app/study/page.tsx
git checkout client/src/app/research/page.tsx

# Then restart
npm run dev  # in server folder
npm run dev  # in client folder
```

---

## Performance Check

### Things to verify:
- ✅ Server starts without errors
- ✅ Upload button appears
- ✅ Form submission doesn't hang
- ✅ File transfers quickly
- ✅ Database insert completes
- ✅ List refreshes after upload

### Expected timing:
- Form load: < 1 second
- File selection: instant
- Upload (5MB file): 2-5 seconds
- List refresh: < 1 second
- **Total:** < 10 seconds for complete flow

---

## Questions?

Refer to main documentation:
- **Audit Report:** `UPLOAD_SYSTEM_AUDIT.md`
- **Full Implementation:** `UPLOAD_SYSTEM_IMPLEMENTATION_COMPLETE.md`
- **Database Schema:** `DATABASE_AUDIT_REPORT.md`

---

**Last Updated:** April 7, 2026  
**Status:** ✅ Ready to Test  
**Estimated Test Time:** 5-10 minutes

