class TagsController < ApplicationController
  before_action :require_login, except: [:index, :show]

  # GET /tags
  def index
    @tags = Tag.all

    render json: @tags
  end

  # GET /tag/:id
  def show
    @posts = Post.where(tag_id: params[:id])

    render json: @posts
  end

  # POST /tags
  def create
    @tag = Tag.new(tag_params)

    if @tag.save
      render json: @tag, status: :created, location: @tags
    else
      render json: @tag.errors, status: :unprocessable_entity
    end
  end

  private

  def tag_params
    params.require(:tag).permit(:name)
  end
end
