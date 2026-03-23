📱 Child Health Development Record System - Mobile App
A comprehensive digital health solution for tracking child development from birth to 5 years.

This mobile application bridges the gap between parents and healthcare professionals by providing a centralized platform to monitor child health, track developmental milestones, manage vaccinations, and access AI-powered health advice.

👥 Who It's For
Users
Parents -->	Track child's growth, report milestones, view vaccination schedules, ask AI health assistant
Midwives -->	Manage all children in their area, record immunizations, confirm milestones, generate health reports


# **Work Contribution**

1.** R.M.S Wijekoon(10965657) --->  Authentication & User Core 

- app/parent/parent-login.tsx
- app/midwife_details/midwife-login.tsx
- app/midwife_details/add_child_form.tsx

- firebase/services/authService.ts
- firebase/services/rolesService.ts 
- firebase/services/usersServices.ts 
- firebase/services/staffService.ts
- firebase/populateData/addRoles.ts
- firebase/populateData/addUsers.ts
- firebase/populateData/addStaff.ts
- firebase/services/childrenService.ts (shared)

- AddChildHeader
- BackToMyChildrenLink
- BirthMeasurementsRow
- CustomInput
- DateOfBirthPicker 
- FormActionButtons
- GenderSelector 
- MidwifeInfoCard
- ParentSelectorCard

2. ** N.MEdussuriya (10965365)---> Midwife Dashboard & Child Management
   
- app/midwife/MidwifeDashboard.tsx -Nulara
- app/midwife_details/my-children.tsx

- app/parent/AIChatScreen.tsx
- firebase/services/realAIService.ts firebase/firebaseConfig.ts
- firebase/services/childrenService.ts
- firebase/services/parentsService.ts
- firebase/populateData/addChildren.ts
- firebase/populateData/addParent.ts
- firebase/populateData/assignChildrenToMidwife.ts
- firebase/populateData/assignAllMidWivesChildren.ts

- ChildOverviewCard.tsx
- DashboardHeader.tsx
- QuickActionCard.tsx
- QuickLinksRow.tsx
- MyChildrenHeader.tsx
- AddChildButton.tsx
- ChildrenSummary.tsx
- ChildListItem.tsx
- EmptyChildrenState.tsx

3. **W.D.T.U Anuda (10965154)  ----> Child form
   
- app/midwife_details/child health form.tsx
- types.ts
- AddChildHeader.tsx
- BackToMyChildrenLink.tsx
- BirthMeasurementsRow.tsx
- CustomInput.tsx
- DateOfBirthPicker.tsx
- FormActionButtons.tsx
- GenderSelector.tsx
- MidwifeInfoCard.tsx
- ParentSelectorCard.tsx
- ChildHealthHeader.tsx
- FollowUpChildInfoCard.tsx
- FollowUpPeriodPicker.tsx
- RecentFollowUpsCard.tsx

4. ** D.A.C.T Jayashantha (10965400) ---> D.A.C.T Jayashantha
   
- app/midwife_details/immunization.tsx
- app/parent/Immunization.tsx

- firebase/services/immunizationService.ts
- firebase/services/vaccineService.ts
- firebase/populateData/addVaccines.ts

- ChildInfoCard.tsx
- CustomInput.tsx
- DateBatchCard.tsx
- ImmunizationHeader.tsx
- ImmunizationSummaryCard.tsx
- VaccineSelectionTable.tsx
- ParentImmunizationAgeGroupCard.tsx
- ParentImmunizationEmptyState.tsx
- ParentImmunizationHeader.tsx
- ParentImmunizationProgress.tsx
- ParentImmunizationRecordItem.tsx
- ParentImmunizationStats.tsx
- ParentImmunizationSummaryTable.tsx

5. A.W.A Tharushika (10965622) ----> Developmental Milestones
   
- app/parent/add_development_milestone.tsx
- app/parent/milestone_vision.tsx
- app/parent/milestone_development.tsx
- app/midwife_details/confirm_development_milestone.tsx
- firebase/services/milestoneDevelopmentService.ts
- firebase/services/childMilestoneService.ts
- firebase/populateData/addMilestone.ts

- AgeGroupPicker.tsx
- MilestoneActions.tsx
- MilestoneItem.tsx
- ParentMilestoneHeader.tsx
- SubmittedSummary.tsx
- ConfirmMilestoneHeader.tsx
- CustomInput.tsx
- MilestoneDetailCard.tsx
- PendingMilestonePicker.tsx
- PendingMilestoneSummary.tsx
- ScreeningHeader.tsx
- ScreeningQuestionCard.tsx
- ScreeningSummary.tsx
- ScreeningTypeSelector.tsx

6. I.U Juwanabadu (10965408) ----> Screening
   
- app/midwife_details/view-screening-response.tsx
- app/midwife_details/midwife-allinfo_page.tsx

- firebase/services/screeningQuestionService.ts
- firebase/services/screeningResponseService.ts
- firebase/services/screeningTypeService.ts
- firebase/populateData/addSampleScreeningResponse.ts
- firebase/populateData/addScreeningQuestions.ts
- firebase/populateData/addScreenType.ts

- ChatHeader.tsx
- ChatInputBar.tsx
- ChatMessageItem.tsx
- ScreeningBottomActions.tsx
- ScreeningChildSection.tsx
- ScreeningFiltersCard.tsx
- ScreeningPageHeader.tsx
- ScreeningResponseItem.tsx
- ScreeningSummaryCards.tsx

 7. **E.P.O Karunathilaka (10965115) ----> Reports & Parent Dashboard

- app/midwife_details/ReportScreen.tsx
- app/parent/parent-dashboard.tsx

- firebase/services/reportService.ts
- 
Components (5):
- ReportChildCard.tsx
- ReportHeader.tsx
- ReportRecordRow.tsx
- ReportSection.tsx
- ReportSummaryGrid.tsx
 
