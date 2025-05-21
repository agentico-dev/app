# Agentico Dashboard

Even before agents can be deployed, and trained, you need to ensure that they are properly integrated with your existing systems. Model Context Protocol (MCP) is a powerful tool that allows you to do just that. With MCP, you can easily integrate your agents with your existing systems, ensuring that they have access to the data and resources they need to perform their tasks effectively.

Agentico is the ultimate tool for managing your AI integrations with backend and legacy systems. Our platform provides a comprehensive solution for managing your MCP Projects, allowing you to easily create, manage, and deploy tools and agents. With Agentico, you can streamline your AI integrations and ensure that your agents are always up-to-date and performing at their best.

We need to start with strong foundations, and that is why we are building a dashboard that will allow you to manage your projects, and dependencies.

## Future Work

With our dashboard, you can easily track and analyze your agents' activities, monitor their performance, and make data-driven decisions to improve your business.


## Stack

- React Router v7
- Vite
- TypeScript
- shadcn-ui
- Tailwind CSS

## 

We have this hierarchy: A project can have associated servers and tools, such as project_servers and project_tools DB tables, respectively (the Project can be seen as the root). If tools are disassociated from a project, then the tools associated with a server (server_tools DB table) should be removed too, because the tools are not available in the project.