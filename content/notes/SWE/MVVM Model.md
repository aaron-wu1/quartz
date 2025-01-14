---
title: MVVM Model
date: 2024-01-03
---
### Definition
Similar to the [[MVC model]] but the controller is replaced with ViewModel or VM.

A ViewModel acts like an API that can be accessed by the view to change itself. The dependency is reversed compared to [[MVC model|MVC]]

### Example 
Given``template.html`` and ``component.ts``
```TS
@Component()

export class ThemeComponent implements OnInit{
	themeName: string = "hiiii"
}
```

View is able to access name with:
```HTML
<p>{{themeName}}</p>
```

### Visual
![[Pasted image 20240103215512.png]]
**insight:** In Angular MVVM can be defined as
- View: html
- ViewModel: component.ts
- Model: Services, eg. firebase service


### Source
https://www.digitalocean.com/community/tutorials/angular-angular-mvc-primer