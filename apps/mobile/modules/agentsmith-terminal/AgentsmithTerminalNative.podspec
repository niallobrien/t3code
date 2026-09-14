require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'AgentsmithTerminalNative'
  s.version = package['version']
  s.summary = 'Native terminal surface for AgentSmith mobile.'
  s.description = 'Native terminal surface bridge used by the AgentSmith React Native app.'
  s.homepage = 'https://agentsmith.com'
  s.license = { :type => 'UNLICENSED' }
  s.author = { 'AgentSmith' => 'hello@agentsmith.com' }
  s.platforms = { :ios => '16.1' }
  s.source = { :path => '.' }
  s.source_files = 'ios/**/*.{h,m,mm,swift}'
  s.vendored_frameworks = 'Vendor/libghostty/GhosttyKit.xcframework'
  s.frameworks = 'IOSurface', 'Metal', 'MetalKit', 'QuartzCore', 'UIKit'
  s.libraries = 'c++', 'z'
  s.swift_version = '5.9'
  s.dependency 'ExpoModulesCore'
end
