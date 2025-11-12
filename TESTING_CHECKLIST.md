# Dashboard Testing Checklist

## New Features to Test

### 1. Delete Event Functionality ✅

**Test Cases:**
- [ ] Click "Delete" button on an event card
- [ ] Verify confirmation dialog appears
- [ ] Click "Cancel" in confirmation → dialog should close, event should remain
- [ ] Click "Yes, Delete" → event should be deleted
- [ ] Verify event disappears from the list after deletion
- [ ] Verify event count updates correctly
- [ ] Test with multiple events

**Expected Behavior:**
- Confirmation dialog shows before deletion
- Event is removed from DynamoDB via API
- List refreshes automatically
- Error handling if deletion fails

### 2. Event Detail Modal ✅

**Test Cases:**
- [ ] Click "View Details" button on an event card
- [ ] Verify modal opens with full event information
- [ ] Check all fields are displayed correctly:
  - [ ] Event ID
  - [ ] Event Type
  - [ ] Source
  - [ ] Status (with color badge)
  - [ ] Ingested At timestamp
  - [ ] Payload (formatted JSON)
  - [ ] Raw event data
- [ ] Click "Copy" button next to Event ID → verify copied to clipboard
- [ ] Click "Copy JSON" button → verify payload copied to clipboard
- [ ] Click "Copy All" button → verify full event copied to clipboard
- [ ] Click "Close" button or outside modal → modal should close
- [ ] Test with events that have large payloads
- [ ] Test with events that have nested JSON structures

**Expected Behavior:**
- Modal displays all event information
- Copy buttons work correctly
- Modal is responsive on mobile devices
- Clicking outside closes the modal

### 3. Bulk Operations ✅

**Test Cases:**
- [ ] Check individual event checkboxes → verify selection counter updates
- [ ] Click "Select All" checkbox → all events on current page should be selected
- [ ] Uncheck "Select All" → all events should be deselected
- [ ] Select multiple events → verify bulk actions bar appears
- [ ] Click "Bulk Acknowledge" → verify all selected events are acknowledged
- [ ] Verify selection clears after bulk acknowledge
- [ ] Select multiple events → click "Bulk Delete"
- [ ] Verify confirmation dialog appears
- [ ] Confirm deletion → verify all selected events are deleted
- [ ] Verify selection clears after bulk delete
- [ ] Click "Clear Selection" → all checkboxes should be unchecked
- [ ] Test with different status filters (pending, delivered, etc.)
- [ ] Test error handling if bulk operation partially fails

**Expected Behavior:**
- Checkboxes allow individual selection
- "Select All" selects/deselects all events on current page
- Bulk actions bar appears when events are selected
- Bulk operations process all selected events
- Selection clears after successful operations
- Error messages shown if operations fail

## Core Functionality Tests

### API Key Management
- [ ] Enter valid API key → should validate successfully
- [ ] Enter invalid API key → should show error
- [ ] Clear API key → should remove from localStorage
- [ ] API key persists across page refreshes

### Event List Display
- [ ] Events load and display correctly
- [ ] Date formatting is correct
- [ ] Status colors are correct
- [ ] Event payload displays properly

### Event Acknowledgment
- [ ] Click "Acknowledge" → event status changes to "acknowledged"
- [ ] Acknowledged events show "✓ Acknowledged" instead of button
- [ ] Event list refreshes after acknowledgment

### Status Filtering
- [ ] Filter by "pending" → only pending events shown
- [ ] Filter by "delivered" → only delivered events shown
- [ ] Filter by "acknowledged" → only acknowledged events shown
- [ ] Filter by "all" → all events shown

### Pagination
- [ ] Click "Next" → loads next page
- [ ] Click "Previous" → goes back
- [ ] Cursor-based pagination works correctly

### Real-time Polling
- [ ] Events auto-refresh every 5 seconds
- [ ] New events appear automatically
- [ ] Polling pauses when tab is inactive

## Error Handling Tests

### Network Errors
- [ ] Disconnect internet → error message shown
- [ ] Reconnect → recovers automatically

### API Errors
- [ ] Invalid API key → "Unauthorized" error
- [ ] 404 errors → "Not found" error
- [ ] 500 errors → "Server error" message

### Error Boundary
- [ ] Component errors → error boundary UI shown
- [ ] Retry button → reloads the app

## Edge Cases

### Empty State
- [ ] No events → "No events found" message

### Large Payloads
- [ ] Events with large JSON payloads → display correctly
- [ ] Very long event IDs → wrap properly

### Multiple Browser Tabs
- [ ] API key set in one tab → works in other tabs
- [ ] Changes in one tab → reflect in others (if polling)

## Performance Tests

### Loading States
- [ ] Initial load → loading spinner shown
- [ ] Refreshing → loading indicator shown

### Caching
- [ ] React Query caches responses
- [ ] Refetching is efficient

## Browser Compatibility

Test on:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design

- [ ] Desktop view (1920x1080)
- [ ] Tablet view (768px)
- [ ] Mobile view (375px)
- [ ] All buttons and modals work on mobile

## Quick Test Script

1. **Open dashboard**: http://localhost:3001
2. **Enter API key**: `pMbRCymoQgCriruN_05vwwIeN9_LYoMs`
3. **Test delete**: Click delete on an event, confirm
4. **Test detail modal**: Click "View Details", verify all info, test copy buttons
5. **Test bulk operations**: Select multiple events, try bulk acknowledge and delete
6. **Test filtering**: Change status filter, verify events update
7. **Test pagination**: Navigate through pages if multiple events exist
8. **Test polling**: Wait 5 seconds, verify events refresh

## Known Issues

None currently. Report any issues found during testing.

## Test Results

Date: _______________
Tester: _______________

### Pass/Fail Summary
- Delete Functionality: [ ] Pass [ ] Fail
- Event Detail Modal: [ ] Pass [ ] Fail
- Bulk Operations: [ ] Pass [ ] Fail
- Core Functionality: [ ] Pass [ ] Fail
- Error Handling: [ ] Pass [ ] Fail

### Notes
_________________________________________________
_________________________________________________
_________________________________________________

