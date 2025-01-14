---
title: "@property decorator"
date: 2024-01-03
---
### Purpose
property objects provides an interface for getter and setter functions. The [[Decorator|decorator]] creates a property object interface for the inner function.

### Defintion
```python
property(fget=None, fset=None, fdel=None, doc=None)
```
- `fget` : function to get value of the attribute
- `fset`: function to set value of the attribute
- `fdel`: function to delete the attribute
- `doc`: string - like a comment

### Example without decorator
Example of property object (without decorator), temperature, running when instantiated
```python
class Celsius:
	def __init__(self, temperature=0):
		self.temperature = temperature
	# Note '_' dentoes private variable
	def get_temperature(self):
		return self._temperature
	def set_temperature(self, value):
		print("SETTING VAL")
		if value > 200:
			raise ValueError("Temperature too high")
		self._temperature = value
	# class variable
	temperature = property(get_temperature, set_temperature)

test = Celsius(50)
print(test.temperature)
test.temperature = 500
# Output: 
# SETTING VAL
# 50
# Temperature too high
```
**Note:** we can now disregard using ``test.set_temperature(100)`` but instead use ``test.temperature = 100`` to set values. Also we can compute some logic to check if the new value meets constraints (temperature being too high). This keeps all the code inside of the class function.

### Example with decorator
```python
class Celsius:
	def __init__(self, temperature=0):
		self.temperature = temperature
	# Note '_' dentoes private variable
	@property
	def temperature(self):
		return self._temperature
	@temperature.setter
	def temperature(self, value):
		print("SETTING VAL")
		if value > 200:
			raise ValueError("Temperature too high")
		self._temperature = value

test = Celsius(50)
print(test.temperature)
test.temperature = 500
# Output: 
# SETTING VAL
# 50
# Temperature too high
```


### Prerequisite knowledge
- Note in python when you call ``class.field``
```
```python
class Celsius:
	def __init__(self, temperature=0)
		self.temperature = temperature

human = Celsius()
human.temperature = 37
print(human.__dict__)
# Output: 'temperature': 37
```
