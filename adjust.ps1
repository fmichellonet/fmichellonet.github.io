cd C:\fmichellonet.github.io
$files = Get-ChildItem . -recurse *.html
foreach ($file in $files)
{
    (Get-Content $file.PSPath) |
    Foreach-Object { $_ -replace "http://localhost:2368/", "http://www.mymemoryleaks.fr/" } |
    Set-Content $file.PSPath
}