import fastify from "fastify"
import Task from "../controllers/taskController"

const app = fastify()

const task = new Task()
// routes

// GET - /tasks
// Deve ser possível listar todas as tasks salvas no banco de dados.
// Também deve ser possível realizar uma busca, filtrando as tasks pelo `title` e `description`

app.get('/tasks', task.list)
app.get('/tasks/csv', task.csv)
app.post('/tasks', task.create)
app.put('/tasks/:id', task.update)
app.patch('/tasks/:id/complete', task.complete)

app.delete('/tasks/:id', task.delete)



app.get('/', async (req, reply) => {
  const routes = app.printRoutes({ commonPrefix: false})
  const message 
  = `Rotas da aplicação 
  ${routes}`
  return reply.send(message)
})


app.listen({
  port: 3333
}).then(() => {
  console.log('Server runing!')
})