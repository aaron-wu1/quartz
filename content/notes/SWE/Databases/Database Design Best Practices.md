---
title: Database Design Best Practices
date: 2024-01-04
---
### Consider
- Minimizing redundancy
- Protecting accuracy
- Being accessible
- Meeting expectations

### Figuring out goals
- Identify what kind of data will go into the database
- Review each process involved in collecting or processing the data
- Identify the types of data fields 

### SQL vs NoSQL
**SQL**
- Difficult to scale vertically
- Horizontal scaling might not be appropriate with every database use
**[[NoSQL Databases|NoSQL]]**

### Data models
- **Relational database**: All relationships are already defined.
- **Hierarchical database**: A one-to-many structure
- **Network database**: one-to-many or many-to-one
- **Object-oriented database**: uses objects rather than tables

### Database design best practices
1. **Keep it simple**
	- **Use standardization**: stay consistent with naming conventions and avoid abbreviations
	- **Consider future modifications**
	- **Keep technical debt in check**
2. **Normalize your data**
	- **Verify dependencies**: make sure your dependencies are in order and remain consistent throughout your database
	- **Prevent anomalies**: Update, insertion, and deletion anomalies can be prevented by double-checking your database dependencies
3. **Consider the running conditions**
	- **Design for the long term**
	- **Create documentation**
	- **Diagram your data**
	- **Plan for resource limitations**
4. **Collaborate**/**Communicate expectations**
5. **Model your data and look for the right fit for your needs**
	- **Minimize unnecessary maintenance**
	- **Use visualization**: create a diagram and test it. 
	- **Test your database**: eg. run queries and document times

