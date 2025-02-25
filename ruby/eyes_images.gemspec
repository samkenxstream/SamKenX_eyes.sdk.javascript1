# frozen_string_literal: true

lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

require 'applitools/version'

Gem::Specification.new do |spec|
  spec.name          = 'eyes_images'
  spec.version       = Applitools::IMAGES_VERSION
  spec.authors       = ['Applitools Team']
  spec.email         = ['team@applitools.com']
  spec.description   = 'Provides Images SDK for Applitools tests.'
  spec.summary       = 'Applitools Ruby Images SDK'
  spec.homepage      = 'https://www.applitools.com'
  spec.license       = 'Applitools'

  spec.metadata['yard.run'] = 'yri' # use "yard" to build full HTML docs.

  spec.files         = `git ls-files lib/applitools/images`.split($RS) +
    ['lib/eyes_images.rb', 'lib/applitools/version.rb']
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = %w(lib)
  spec.add_dependency 'eyes_core', "= #{Applitools::VERSION}"
end
