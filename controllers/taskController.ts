import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../utils/prisma";
import fs from 'fs';
import { json2csv } from 'json-2-csv'

export default class Task {
  
  // - Listagem de todas as tasks
  async list(req: FastifyRequest, reply: FastifyReply) {
    const tasks = await prisma.task.findMany()

    reply.send(tasks)
  }
  
  // - Criação de uma task
  async create(
    req: FastifyRequest<{ Body: { title: string, description: string | null, }}>, 
    reply: FastifyReply
  ) {
    try{
      const { title, description } = req.body

      await prisma.task.create({
        data: {
          title,
          description,
        }
      })

      reply.send({
        message: 'tarefa criada'
      })
    } catch (error) {
      reply.code(500).send({error: 'ocorreu um erro para criar a tarefa'})
    }
  }

  // - Atualização de uma task pelo `id`
  // - Marcar pelo `id` uma task como completa
  async update(
    req: FastifyRequest<{ 
      Params: { id: string }, 
      Body: { title: string, description: string, isDone: boolean }
    }>, 
    reply: FastifyReply
  ) {
    const { id } = req.params

    const { title, description, isDone } = req.body

    await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        isDone,
      }
    })

    const task = await prisma.task.findMany({ where: { id,}})

    reply.send({
      mensage: 'sua tarefa foi atualizada',
      task,
    })

  }

  async complete(
    req: FastifyRequest<{ Params: { id: string }}>, 
    reply: FastifyReply
  ) {

    const { id } = req.params

    try {
      await prisma.task.update({
        where: {
          id,
        },
        data: {
          isDone: true
        }
      })
  
      return reply.code(201).send({
        message: `Marcada como concluida`
      })
    } catch(error) {
      return reply.code(400).send({ message: 'Ocorreu um erro ao marcar a tareca como concluida'})
    }

  }
  // - Remover uma task pelo `id`
  async delete(
    req: FastifyRequest<{ Params: { id: string }}>, 
    reply: FastifyReply
  ) {
    const { id } = req.params

    try {
      await prisma.task.delete({ where: { id,} })
    } catch (error) {
      return reply.code(500).send('Ocorreu um erro ao deletar a tarefa')
    }

    return reply.code(201).send({
      message: 'sua tarefa foi deletada'
    })
  }


  async csv(
    req: FastifyRequest, 
    reply: FastifyReply
  ) {
    const tasks = await prisma.task.findMany()
    const csvData = await json2csv(tasks, {
      delimiter: {
        field: ';' // Delimitador de campo
      },
      excelBOM: true
    })

    reply.header('Content-Type', 'text/csv')
    reply.header('Content-Disposition', 'attachment; filename=tasks.csv')

    return csvData;
  }

  // - E o verdadeiro desafio: Importação de tasks em massa por um arquivo CSV

  
}