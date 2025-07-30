# PowerShell script to batch update Prisma imports to Supabase in API routes
# This script replaces common Prisma patterns with Supabase equivalents

$apiPath = "c:\GitHub\v0-athlink-platform\app\api"
$files = Get-ChildItem -Path $apiPath -Filter "*.ts" -Recurse

Write-Host "Found $($files.Count) TypeScript files in API directory"

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Skip if already updated (contains supabase imports)
    if ($content -match "@/lib/supabase") {
        Write-Host "  Skipping - already uses Supabase"
        continue
    }
    
    # Skip if no prisma imports
    if (-not ($content -match "prisma|@prisma|PrismaClient")) {
        Write-Host "  Skipping - no Prisma imports found"
        continue
    }
    
    Write-Host "  Updating Prisma imports..."
    
    # Replace imports
    $content = $content -replace "import \{ auth \} from.*auth.*", "import { supabase, supabaseAdmin } from '@/lib/supabase'"
    $content = $content -replace "import \{ prisma \} from.*prisma.*", ""
    $content = $content -replace "import \{ PrismaClient \} from.*prisma.*", ""
    $content = $content -replace "const prisma = new PrismaClient\(\)", ""
    
    # Replace auth patterns
    $content = $content -replace "const session = await auth\(\)", "const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }"
    
    # Replace session checks
    $content = $content -replace "if \(!session\?\?\.user\?\?\.email\)", "if (!user)"
    $content = $content -replace "session\.user\.email", "user.email"
    $content = $content -replace "session\.user\.id", "user.id"
    
    # Add comment about manual review needed
    if ($content -ne $originalContent) {
        $header = "// WARNING: This file was automatically updated from Prisma to Supabase
// Please review and test all database operations carefully
// Some complex queries may need manual adjustment

"
        $content = $header + $content
        
        # Create backup
        $backupFile = $file.FullName + ".prisma-backup"
        Copy-Item $file.FullName $backupFile
        Write-Host "  Created backup: $backupFile"
        
        # Write updated content
        Set-Content -Path $file.FullName -Value $content
        Write-Host "  Updated successfully - REQUIRES MANUAL REVIEW"
    } else {
        Write-Host "  No changes made"
    }
}

Write-Host ""
Write-Host "Batch update complete!"
Write-Host "IMPORTANT: All updated files need manual review to:"
Write-Host "1. Update Prisma query syntax to Supabase"
Write-Host "2. Handle UUID vs integer ID conversions"
Write-Host "3. Test all database operations"
Write-Host "4. Update relationship queries"
