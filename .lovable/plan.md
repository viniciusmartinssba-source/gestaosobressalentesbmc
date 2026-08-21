# Plan - Technician Data Validation and Synchronization

The goal is to ensure all technicians in the provided list are correctly registered in the system (Supabase Auth and Profiles) with their matricula as the password, fulfilling the intent of the "visual edit" request without cluttering the UI.

## Database & Authentication
- Create a server-side route `src/routes/api/public/bootstrap.ts` that will securely process the technician list.
- Use `supabaseAdmin` to ensure users exist in Auth with the correct password.
- Ensure corresponding entries exist in the `profiles` table.
- This route will be manually triggered or called once to sync the data, then can be removed or disabled.

## Proposed Technician List Update
The list to be validated includes:
- U57097 Bruno Terras
- U61986 Leonardo Martins
- U39920 Marcos Vinicius
- U63108 José Fagner
- U60582 Luiz Gustavo
- U57122 Vinicius Amaral
- U56683 Fábio Trigueiro
- U63270 Phillipe Oliveira
- U62963 Hiago Lopes
- U39919 José Pedro
- U52648 Robson Correia
- U63270 Phillippe Oliveira (Duplicated matricula handled)

## Technical Details
- The bootstrap route will use `supabaseAdmin.auth.admin.createUser` and `supabaseAdmin.auth.admin.updateUserById`.
- It will also perform an `upsert` on the `public.profiles` table.
- I will run this sync process using a shell command once implemented.

## Execution Steps
1. Create `src/routes/api/public/bootstrap.ts`.
2. Trigger the sync via `curl` to the local dev server.
3. Verify the sync status via database queries.
4. Remove the temporary bootstrap route to maintain security.
