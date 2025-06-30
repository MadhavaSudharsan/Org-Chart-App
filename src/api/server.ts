import { createServer, Model, Response } from "miragejs";

export function makeServer() {
	return createServer({
		models: {
			employee: Model,
		},

		seeds(server) {
			const savedEmployees = localStorage.getItem('orgchart-employees');
			
			if (savedEmployees) {
				const employees = JSON.parse(savedEmployees);
				employees.forEach((emp: any) => {
					server.create("employee", emp);
				});
				return;
			}
			
			// CEO
			server.create("employee", {
				id: "emp-1",
				name: "Mark Hill",
				designation: "Chief Executive Officer",
				team: "Executive",
				managerId: null,
				avatar: "https://randomuser.me/api/portraits/men/11.jpg",
			});
			// Direct reports to CEO
			server.create("employee", {
				id: "emp-2",
				name: "Joe Linux",
				designation: "Chief Technology Officer",
				team: "Technology",
				managerId: "emp-1",
				avatar: "https://randomuser.me/api/portraits/men/12.jpg",
			});

			server.create("employee", {
				id: "emp-3",
				name: "Linda May",
				designation: "Chief Business Officer",
				team: "Business",
				managerId: "emp-1",
				avatar: "https://randomuser.me/api/portraits/women/13.jpg",
			});

			server.create("employee", {
				id: "emp-4",
				name: "John Green",
				designation: "Chief Accounting Officer",
				team: "Finance",
				managerId: "emp-1",
				avatar: "https://randomuser.me/api/portraits/men/14.jpg",
			});

			// Reports to Joe Linux
			server.create("employee", {
				id: "emp-5",
				name: "Ron Blomquist",
				designation: "Chief Information Security Officer",
				team: "Security",
				managerId: "emp-2",
				avatar: "https://randomuser.me/api/portraits/men/15.jpg",
			});

			server.create("employee", {
				id: "emp-6",
				name: "Michael Rubin",
				designation: "Chief Innovation Officer",
				team: "Innovation",
				managerId: "emp-2",
				avatar: "https://randomuser.me/api/portraits/men/16.jpg",
			});

			// Reports to Linda May
			server.create("employee", {
				id: "emp-7",
				name: "Alice Lopez",
				designation: "Chief Communications Officer",
				team: "Communications",
				managerId: "emp-3",
				avatar: "https://randomuser.me/api/portraits/women/17.jpg",
			});

			server.create("employee", {
				id: "emp-8",
				name: "Mary Johnson",
				designation: "Chief Brand Officer",
				team: "Brand",
				managerId: "emp-3",
				avatar: "https://randomuser.me/api/portraits/women/18.jpg",
			});

			server.create("employee", {
				id: "emp-9",
				name: "Kirk Douglas",
				designation: "Chief Business Development Officer",
				team: "BizDev",
				managerId: "emp-3",
				avatar: "https://randomuser.me/api/portraits/men/19.jpg",
			});

			// Reports to John Green
			server.create("employee", {
				id: "emp-10",
				name: "Erica Reel",
				designation: "Chief Customer Officer",
				team: "Customer",
				managerId: "emp-4",
				avatar: "https://randomuser.me/api/portraits/women/20.jpg",
			});
		},

		routes() {
			this.namespace = "api";

			this.get("/employees", (schema) => {
				// @ts-ignore - miragejs typing limitation
				return schema.all("employee");
			});

			this.post("/employees", (schema, request) => {
				const attrs = JSON.parse(request.requestBody);
								
				const employee = (schema as any).create("employee", attrs);
								
				// Persist to localStorage
				const allEmployees = (schema as any).all("employee").models.map((m: any) => m.attrs);
				localStorage.setItem('orgchart-employees', JSON.stringify(allEmployees));
				
				return (employee as any).attrs ?? employee;
			});

			this.put("/employees/:id", (schema, request) => {
				const id = request.params.id;
				const attrs = JSON.parse(request.requestBody);
								
				const employee = (schema as any).find("employee", id);
				
				if (employee) {
					const updated = (employee as any).update(attrs);
										
					// Persist to localStorage
					const allEmployees = (schema as any).all("employee").models.map((m: any) => m.attrs);
					localStorage.setItem('orgchart-employees', JSON.stringify(allEmployees));
					
					return (updated as any).attrs ?? updated;
				}
				
				return new Response(404, {}, { error: "Employee not found" });
			});

			// DELETE endpoint
			this.delete("/employees/:id", (schema, request) => {
				const id = request.params.id;				
				const employee = (schema as any).find("employee", id);
				
				if (employee) {
					(employee as any).destroy();
					
					// Persist to localStorage after deletion
					const allEmployees = (schema as any).all("employee").models.map((m: any) => m.attrs);
					localStorage.setItem('orgchart-employees', JSON.stringify(allEmployees));
					
					return new Response(204);
				}
				
				return new Response(404, {}, { error: "Employee not found" });
			});
		},
	});
}
