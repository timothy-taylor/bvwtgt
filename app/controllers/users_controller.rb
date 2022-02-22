class UsersController < ApplicationController
  before_action :set_user, only: %i[ show update destroy ]
  before_action :require_login, except: [:show]

  # GET /users
  def index
    @users = User.all.pluck(:id,:email)

    render json: @users
  end

  # GET /users/1
  def show
    @user = User.find(params[:id]).pluck(:id,:email)
    render json: @user
  end

  # PATCH/PUT /users/1
  def update
      @user = User.find(params[:id])
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
      @user = User.find(params[:id])
    @user.destroy
  end

  private
    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
end
