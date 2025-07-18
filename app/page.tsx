'use client'
import { useState, useEffect, Children } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

interface ListTodosData {
    items: Array<Schema["Todo"]["type"]>;
  }

function App() {
    
  const { signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  function deleteTodo(id: string): void {
    client.models.Todo.delete({ id });
  }

  function listTodos(): void {
    client.models.Todo.observeQuery().subscribe({
      next: (data: ListTodosData) => setTodos([...data.items]),
    });
  }

  useEffect((): void => {
    listTodos();
  }, []);

  function createTodo(): void {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (    
      <main>
        <h1>My todos</h1>
        <button onClick={createTodo}>+ new</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.content}<button onClick={()=>{deleteTodo(todo.id)}}>X</button></li>
          ))}
        </ul>
        <div>
          🥳 App successfully hosted. Try creating a new todo.
          <br />
          <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
            Review next steps of this tutorial.
          </a>
        </div>
        <button onClick={signOut}>Sign out</button>
      </main>
  );
}

// Corrected withAuth HOC
function withAuth(AppComponent: React.FC) {
  return function AuthenticatedApp(props: any) { // This now returns a function
    return (
      <Authenticator>
        <AppComponent {...props} />
      </Authenticator>
    );
  };
}

export default withAuth(App);
