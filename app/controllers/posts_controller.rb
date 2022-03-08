# PostAPI, required login for everything but index and show
class PostsController < ApplicationController
  before_action :set_post, only: %i[show update destroy]
  before_action :require_login, except: %i[index show]

  def index
    @posts = Post.all.select(:id, :title, :created_at).order(created_at: :desc)

    render json: @posts
  end

  def show
    render json: @post
  end

  def create
    @post = Post.new(post_params)

    if @post.save
      render json: @post, status: :created, location: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  def update
    if @post.update(post_params)
      render json: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @post.destroy
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def post_params
    params.require(:post).permit(:title, :content, :tag_id)
  end
end
