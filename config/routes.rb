Rails.application.routes.draw do
  scope '/api' do
    resources :posts
    resources :users, only: %i[show update]
    resources :tags, only: %i[index show create]

    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    get '/logged_in', to: 'sessions#is_logged_in?'
  end

  get '*path',
      to: 'application#fallback_index_html',
      constraints: ->(request) do 
        !request.xhr? && request.format.html? 
      end
end
