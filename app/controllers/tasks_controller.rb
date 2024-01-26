class TasksController < ApplicationController
def index
    @tasks = Task.all 
    render json: @tasks
end

def show
    @tasks = Task.find(params[:id])
    render json: @task
end

def create
    @task = Task.create(
        task: params[:task],
        completed: params[:completed]
    )
    render json: @task
end

def update
    @task = Task.find(params[:id])
    @task = Task.update(
        task: params[:task],
        completed: params[:completed]
    )
    render json: @task
end

def destroy
    @tasks = Task.all
    @task = Task.find(params[:id])
    @task.destroy
    render json: @tasks
end

end

