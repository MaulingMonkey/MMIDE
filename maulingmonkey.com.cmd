@git status
@echo.
@echo     DEPLOY CHECKLIST:
@echo [ ] Verify you committed everything
@echo [ ] Check for log spam
@echo [ ] Verify ancillary pages still work properly
@echo [ ] Maybe build Release instead of Debug
@echo.
@pause

mkdir                           I:\home\website\maulingmonkey.com\brainfuck\
robocopy /S   %~dp0\MMIDE       I:\home\website\maulingmonkey.com\brainfuck       *.png *.css *.html *.js
pause
