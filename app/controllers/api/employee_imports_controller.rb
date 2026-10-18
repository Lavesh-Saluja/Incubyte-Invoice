module Api
  class EmployeeImportsController < ApplicationController
    self.accepted_body_types += [ Mime[:multipart_form].to_s ]

    before_action { authorize :employee_import }

    rescue_from ::EmployeeImports::InvalidImportError do |error|
      @result = error.result
      render :invalid, locals: { message: error.message }, status: :unprocessable_content
    end

    def template
      send_data ::EmployeeImports::TemplateService.new.process!,
        filename: ::EmployeeImports::Schema::TEMPLATE_FILENAME, type: Mime[:csv], disposition: :attachment
    end

    def preview
      @result = ::EmployeeImports::PreviewService.new(params.require(:file)).process!
    end

    def create
      @result = ::EmployeeImports::CreateService.new(params.require(:file)).process!
      render :create, status: :created
    end
  end
end
