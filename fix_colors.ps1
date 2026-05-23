$files = Get-ChildItem -Path "src" -Recurse -Include "*.jsx","*.js","*.css"
$replacements = @(
    [pscustomobject]@{From='#7dbe73'; To='#E1E5F2'},
    [pscustomobject]@{From='#7EC8D4'; To='#BFDBF7'},
    [pscustomobject]@{From='#A3D4C8'; To='#E1E5F2'},
    [pscustomobject]@{From='#5BA8B5'; To='#22909F'},
    [pscustomobject]@{From='#2d1535'; To='#022B3A'},
    [pscustomobject]@{From='#7a4d7d'; To='#1F7A8C'}
)
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content
    foreach ($r in $replacements) {
        $content = $content.Replace($r.From, $r.To)
    }
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($file.Name)"
    }
}
Write-Host "Done."
