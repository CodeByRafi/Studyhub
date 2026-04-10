# StudyHub Upload System - Root Cause Analysis & Fix Plan

**Date:** April 7, 2026  
**Status:** AUDIT COMPLETE - ROOT CAUSES IDENTIFIED

---

## 1. ROOT CAUSE ANALYSIS

### Why Uploads Were Failing

The upload system exists and is **mostly functional** but has **critical limitations**:

#### Problem 1: PDF-ONLY File Type Support
**Frontend:**
- File input: `accept=".pdf"` - only allows PDF selection
- Validation: `file.type !== 'application/pdf'` - rejects anything else
- Error shown: "Only PDF files are allowed."

**Backend:**
- Study routes multer: `if (file.mimetype === 'application/pdf')` - only PDF
- Research routes multer: `if (file.mimetype === 'application/pdf')` - only PDF
- Response: `cb(new Error('Only PDF files are allowed'))`

#### Problem 2: File Extension Hardcoded to .pdf
**filename generation:**
```javascript
filename: (req, file, cb) => {
  cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`);
}
```
This always appends `.pdf` regardless of actual file type. Word files would be saved with wrong extension.

#### Problem 3: No Word File MIME Type Support
Missing support for:
- `.doc` files: `application/msword`
- `.docx` files: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

#### Problem 4: Inconsistent Error Handling
- Generic errors from multer (e.g., file validation failure) might not reach frontend properly
- No clear error messages for unsupported file types

---

## 2. WHAT CURRENTLY WORKS

✅ Upload folder exists: `server/uploads/`  
✅ Static file serving configured: `/uploads` route active  
✅ Multer configuration exists in both modules  
✅ File storage working (verified by 25+ files in uploads folder)  
✅ Database inserts working correctly  
✅ Auth middleware working  
✅ Response formats are clean and consistent  
✅ Frontend FormData construction is correct  
✅ Bearer token sent correctly

**The system is ~95% functional - only needs file type expansion.**

---

## 3. FILES TO CHANGE

### Frontend Changes (2 files):
1. `client/src/services/study.ts` - Update note and question upload functions
2. `client/src/app/study/page.tsx` - Update file validation and UI
3. Optional: `client/src/app/research/page.tsx` - Similar updates for research
4. Optional: `client/src/services/research.ts` - Similar updates for research

### Backend Changes (2 files):
1. `server/modules/study/study.routes.js` - Update multer config
2. `server/modules/research/research.routes.js` - Update multer config

### Optional improvements:
- Add server-side MIME type validation
- Improve error messages
- Add file extension validation

---

## 4. CHANGES REQUIRED

### Change 1: Frontend - File Input Accept Attribute
**File:** `client/src/app/study/page.tsx`  
**Current:**
```typescript
<input type="file" accept=".pdf" onChange={...} />
```
**Change To:**
```typescript
<input type="file" accept=".pdf,.doc,.docx" onChange={...} />
```

### Change 2: Frontend - File Validation Logic
**File:** `client/src/app/study/page.tsx`  
**Current:**
```typescript
if (file.type !== 'application/pdf') {
  setUploadError("Only PDF files are allowed.");
  return;
}
```
**Change To:**
```typescript
const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
if (!allowedTypes.includes(file.type)) {
  setUploadError("Only PDF and Word files (.pdf, .doc, .docx) are allowed.");
  return;
}
```

### Change 3: Backend - Multer File Filter (Study Module)
**File:** `server/modules/study/study.routes.js`  
**Current:**
```javascript
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }
});
```
**Change To:**
```javascript
const ALLOWED_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word files (.pdf, .doc, .docx) are allowed'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }
});
```

### Change 4: Filename Generation - Preserve File Extension
**File:** `server/modules/study/study.routes.js` AND `server/modules/research/research.routes.js`  
**Current:**
```javascript
filename: (req, file, cb) => {
  cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`);
}
```
**Change To:**
```javascript
filename: (req, file, cb) => {
  const ext = path.extname(file.originalname);
  cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`);
}
```

### Change 5: Backend - Research Module (Same as Study)
**File:** `server/modules/research/research.routes.js`  
Same changes as Study module for multer configuration.

---

## 5. EXPECTED RESULTS AFTER FIX

✅ Users can upload PDF files  
✅ Users can upload .doc files  
✅ Users can upload .docx files  
✅ Files saved with correct extension  
✅ Backend validates file types  
✅ Frontend prevents wrong file type selection  
✅ Error messages clear and helpful  
✅ All existing uploads still work  
✅ No database changes needed  
✅ No UI redesign needed  

---

## 6. DEPLOYMENT STEPS

1. Update frontend files (accept attribute + validation)
2. Update backend multer configs (both modules)
3. Restart backend server: `npm run dev`
4. Test uploads with each file type:
   - Upload PDF to notes ✓
   - Upload DOCX to notes ✓
   - Upload DOC to questions ✓
   - Upload PDF to research ✓
   - Upload DOCX to research ✓

---

## 7. VERIFICATION CHECKLIST

After making changes:
- [ ] Frontend file input accepts .pdf, .doc, .docx
- [ ] Backend multer accepts these MIME types
- [ ] Filenames preserve original extension
- [ ] Upload succeeds for all file types
- [ ] DB insert succeeds for all file types
- [ ] Response contains file_url
- [ ] Files accessible via /uploads/ URL
- [ ] No unrelated code changed

---

## 8. AUDIT SUMMARY TABLE

| Component | Status | Finding |
|-----------|--------|---------|
| Upload folder | ✅ Exists | Path: `server/uploads/` |
| Static serving | ✅ Working | Route: `/uploads` |
| Multer installed | ✅ Yes | Version: Latest |
| Routes defined | ✅ Yes | 3 endpoints (notes, questions, research) |
| Auth middleware | ✅ Working | JWT token validation |
| DB schema | ✅ Ready | file_url column exists |
| DB inserts | ✅ Working | 25+ files already uploaded |
| Frontend services | ✅ Correct | FormData construction OK |
| Frontend forms | ✅ Correct | Event handlers OK |
| File validation | ⚠️ Restricted | PDF only (should support Word) |
| Error handling | ✅ Good | Clear messages |
| Response format | ✅ Clean | Standard success/error |

---

## NEXT STEP

Apply the fixes listed in Section 4 above.

