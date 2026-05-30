---
title: "如何解决右键菜单没有新建办公文档文件的问题"
date: 2025-05-10
categories: 教程
tags: [Office,WPS,Windows,文件,新建文件,右键新建]
---

> 本文仅讨论在 **Windows** 电脑上解决右键菜单没有新建办公文档文件的方法。

# 方法一

安装办公软件，例如 Office 或 WPS。如已安装却还是没有新建办公文档文件的选项，请看下一节。




# 方法二

找到空白的 .docx .pptx .xlsx文件，分别命名为`Blank.docx` `Blank.pptx` `Blank.xlsx`，并放到一个文件夹中。最好是平时不会碰到的位置，避免误删。记下这个文件夹的路径，例如 `C:\OfficeTemplates` 。

```` reg
Windows Registry Editor Version 5.00

; .docx 绑定到自定义的 office.word
[HKEY_CLASSES_ROOT\.docx]
@="office.word"

[HKEY_CLASSES_ROOT\office.word]
@="Word"
"FriendlyTypeName"="Word"

[HKEY_CLASSES_ROOT\office.word\ShellNew]
"FileName"="C:\\OfficeTemplates\\Blank.docx"

; .xlsx 绑定到自定义的 office.excel
[HKEY_CLASSES_ROOT\.xlsx]
@="office.excel"

[HKEY_CLASSES_ROOT\office.excel]
@="Excel"
"FriendlyTypeName"="Excel"

[HKEY_CLASSES_ROOT\office.excel\ShellNew]
"FileName"="C:\\OfficeTemplates\\Blank.xlsx"

; .pptx 绑定到自定义的 office.ppt
[HKEY_CLASSES_ROOT\.pptx]
@="office.ppt"

[HKEY_CLASSES_ROOT\office.ppt]
@="PPT"
"FriendlyTypeName"="PPT"

[HKEY_CLASSES_ROOT\office.ppt\ShellNew]
"FileName"="C:\\OfficeTemplates\\Blank.pptx"
````

新建空白文件，文件名改为 `**.reg` ，编辑它，输入以下内容并保存（请注意，代码中的 `C:\\OfficeTemplates\\` 要改为你自己的路径）：
双击 .reg ，选择 是 。现在应该已经解决了问题。

（不一定要准备空白文件，你可以在准备的文件中编辑一些内容，这样每次新建的文件都会带上这些内容。）
