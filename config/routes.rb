Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    namespace :health do
      get :live
      get :ready
    end

    resource :session, only: %i[show create destroy]
    resources :employees, only: %i[index show create update] do
      resource :notice_period, only: %i[create destroy], module: :employees
    end
    resource :settings, only: :show
    resource :dashboard, only: :show
    resources :departments, only: %i[index create]
    namespace :select_options do
      resources :countries, only: :index
      resources :departments, only: :index
    end
  end
end
