wget --mirror --adjust-extension --page-requisites --execute robots=off --convert-links --user-agent=Mozilla http://localhost:2368 --directory-prefix="c:\fmichellonet.github.io"
rmdir /S/Q c:\fmichellonet.github.io\localhost
ren "c:\fmichellonet.github.io\localhost+2368" localhost
xcopy "c:\fmichellonet.github.io\localhost\*" "c:\fmichellonet.github.io\" /E /H /R /X /Y /I /K
rmdir /S/Q c:\fmichellonet.github.io\localhost
powershell "./adjust.ps1"
