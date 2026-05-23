$files = Get-ChildItem -Path "src" -Recurse -Include "*.jsx","*.js","*.css"
$replacements = @(
    [pscustomobject]@{From="#0a0710"; To="#011E28"},
    [pscustomobject]@{From="#0f0a10"; To="#022B3A"},
    [pscustomobject]@{From="#1a0f1e"; To="#033A4E"},
    [pscustomobject]@{From="#3d2245"; To="#033A4E"},
    [pscustomobject]@{From="#5a3460"; To="#155E70"},
    [pscustomobject]@{From="#9b6a9e"; To="#22909F"},
    [pscustomobject]@{From="#74457766"; To="#1F7A8C66"},
    [pscustomobject]@{From="#74457750"; To="#1F7A8C50"},
    [pscustomobject]@{From="#74457740"; To="#1F7A8C40"},
    [pscustomobject]@{From="#74457730"; To="#1F7A8C30"},
    [pscustomobject]@{From="#74457720"; To="#1F7A8C20"},
    [pscustomobject]@{From="#74457760"; To="#1F7A8C60"},
    [pscustomobject]@{From="#74457780"; To="#1F7A8C80"},
    [pscustomobject]@{From="#74457733"; To="#1F7A8C33"},
    [pscustomobject]@{From="#74457714"; To="#1F7A8C14"},
    [pscustomobject]@{From="#74457726"; To="#1F7A8C26"},
    [pscustomobject]@{From="#744577"; To="#1F7A8C"},
    [pscustomobject]@{From="F0E9B6"; To="BFDBF7"},
    [pscustomobject]@{From="f0e9b6"; To="BFDBF7"},
    [pscustomobject]@{From="e3da97"; To="A8C8E8"},
    [pscustomobject]@{From="ACCFA3"; To="E1E5F2"},
    [pscustomobject]@{From="accfa3"; To="E1E5F2"},
    [pscustomobject]@{From="84C5B1"; To="BFDBF7"},
    [pscustomobject]@{From="84c5b1"; To="BFDBF7"},
    [pscustomobject]@{From="5dab94"; To="1F7A8C"},
    [pscustomobject]@{From="#74457566"; To="#1F7A8C66"}
)
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content
    foreach ($r in $replacements) {
        $content = $content.Replace($r.From, $r.To)
    }
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated: $($file.Name)"
    }
}
Write-Host "All done."
