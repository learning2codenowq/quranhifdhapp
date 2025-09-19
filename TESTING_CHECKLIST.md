# Manual Testing Checklist

## Core Functionality
- [ ] Onboarding flow completes successfully
- [ ] Settings save and persist after app restart
- [ ] Quran reader loads surahs and ayahs
- [ ] Ayahs can be marked as memorized
- [ ] Memorized ayahs show green background and checkmark
- [ ] Dashboard shows correct statistics

## Tikrar System
- [ ] New memorization tracks daily progress
- [ ] Repetition of yesterday shows correct ayahs
- [ ] Connection calculates last 30 days correctly
- [ ] Revision rotates through 6-day cycle
- [ ] Tikrar activities track completion progress
- [ ] Progress persists between app sessions

## Achievement System
- [ ] Achievements unlock at correct milestones
- [ ] Achievement modal appears for new achievements
- [ ] Achievement screen shows earned vs locked
- [ ] Achievement categories display correctly

## Analytics
- [ ] Weekly analytics show correct data
- [ ] Monthly analytics calculate properly
- [ ] Charts render without errors
- [ ] Tab navigation works in analytics

## Audio System
- [ ] Audio plays when ayah play button pressed
- [ ] Audio stops/pauses correctly
- [ ] Audio buttons show correct play/pause states
- [ ] No crashes when audio fails to load

## Error Handling
- [ ] Network errors show appropriate messages
- [ ] Storage errors don't crash the app
- [ ] Invalid data doesn't break calculations
- [ ] Error boundary catches unexpected crashes

## Performance
- [ ] App launches quickly (< 3 seconds)
- [ ] Scrolling is smooth in all screens
- [ ] Navigation transitions are fluid
- [ ] No memory leaks during extended use

## Edge Cases
- [ ] Works with no internet connection
- [ ] Handles empty state (no memorization)
- [ ] Works after fresh install
- [ ] Survives app backgrounding/foregrounding
- [ ] Settings persist through updates