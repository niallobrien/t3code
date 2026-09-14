#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCTBridge.h"
#import "Utils.h"

@interface AgentsmithMarkdownTextManager : RCTViewManager
@end

@implementation AgentsmithMarkdownTextManager

RCT_EXPORT_MODULE(AgentsmithMarkdownText)

- (UIView *)view
{
  return [[UIView alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(color, NSString, UIView)
{
}

@end

@interface AgentsmithMarkdownTextRunManager : RCTViewManager
@end

@implementation AgentsmithMarkdownTextRunManager

RCT_EXPORT_MODULE(AgentsmithMarkdownTextRun)

- (UIView *)view
{
  return nil;
}

@end
