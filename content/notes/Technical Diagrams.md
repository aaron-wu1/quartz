---
title: "Technical Diagrams"
---

# UML Diagrams
Stands for **U**nified **M**odeling **L**anguage. Used to model software solutions, application structures, system behavior and business processes.

### UML Diagram Types
#### Structure Diagrams:
- [[notes/Technical Diagrams#Class Diagram|Class Diagram]]
#### Behavioral Diagrams:
- [[notes/Technical Diagrams#Activity Diagram|Activity Diagram]]
- [[#Sequence Diagram]]

### Class Diagram
Used to represent a collection of classes.

**Structure:**
- box:
	- name of class
	- attributes of class
	- methods of class
- arrows: relationship between classes

![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/KP-UML-Generalization-20060325.svg/300px-KP-UML-Generalization-20060325.svg.png)

**Relationship notations**
![](https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Uml_classes_en.svg/300px-Uml_classes_en.svg.png)

**Use cases:**
- scope out small ideas before coding
- get early feedback of implementation

### Activity Diagram
Used to represent process flow

**Structure:**
- stadia: actions
- diamonds: decisions
- bars: start or end of concurrent activities
- black circle: start of workflow
- encircled black circle: end of work flow
![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Activity_conducting.svg/440px-Activity_conducting.svg.png)
**Use cases:**
- showcasing work to non-technical colleagues
- address / outlines business requirements

### Sequence Diagram
Shows interactions between classes and system
- typically higher level than class diagrams

**Structure**:
- Top box: class or object
- Dashed line (Lifeline symbol): represents passage of time
- Empty boxes (Activations): represents the time needed for an object to complete a task
- Solid arrowhead, solid line: synchronous message
- Lined arrowhead, solid line: asynchronous message
- Lined arrowhead, dashed line: asynchronous return message / reply message 
- Lined arrowhead, dashed line with <\<create>> symbol: asynchronous return message

![Figure 2. A sequence diagram that has incoming and outgoing messages](https://developer.ibm.com/developer/default/articles/the-sequence-diagram/images/3101_figure2.jpg)

![sequence diagram for an atm system](https://d2slcw3kip6qmk.cloudfront.net/marketing/pages/chart/sequence-diagram-for-ATM-system-UML/sequence_diagram_atm_example-800x1292.png)

Sources:
- https://betterprogramming.pub/a-beginners-guide-to-drawing-technical-diagrams-fb0c97fdbc5e
- https://creately.com/blog/diagrams/uml-diagram-types-examples/

