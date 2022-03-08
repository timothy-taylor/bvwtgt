class UsersController < ApplicationController
  before_action :set_user, only: %i[show update destroy]
  before_action :require_login

  def index
    @users = User.all.pluck(:id, :email)

    render json: @users
  end

  def show
    @user = User.find(params[:id]).pluck(:id, :email)
    render json: @user
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
