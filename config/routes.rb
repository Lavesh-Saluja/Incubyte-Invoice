Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    namespace :health do
      get :live
      get :ready
    end

    resource :session, only: %i[show create destroy]
    resources :employees, only: %i[index show create update]
  end
end
