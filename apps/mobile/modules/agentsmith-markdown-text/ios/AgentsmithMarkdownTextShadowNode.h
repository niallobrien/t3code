#pragma once

#include <react/renderer/components/AgentsmithMarkdownTextSpec/EventEmitters.h>
#include <react/renderer/components/AgentsmithMarkdownTextSpec/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/textlayoutmanager/TextLayoutManager.h>
#include <react/renderer/core/LayoutContext.h>
#include <react/renderer/core/ShadowNode.h>

#include <string>
#include <vector>

namespace facebook::react {

extern const char AgentsmithMarkdownTextComponentName[];

struct AgentsmithMarkdownTextParagraphStyleRange {
  size_t location;
  size_t length;
  Float firstLineHeadIndent;
  Float headIndent;
  Float paragraphSpacing;
};

struct AgentsmithMarkdownTextAttachmentRange {
  size_t location;
  size_t length;
  std::string imageUri;
  /// Recolor the loaded image with the run's foreground color, like `sf:` symbols.
  bool tintWithForeground;
  Float chipWidth = 0;
  Float chipHeight = 0;
};

inline Float AgentsmithMarkdownTextAttachmentSize(const AgentsmithMarkdownTextAttachmentRange &) {
  return 14;
}

inline Float AgentsmithMarkdownTextAttachmentBaselineOffset(
    const AgentsmithMarkdownTextAttachmentRange &) {
  return -2;
}

class AgentsmithMarkdownTextStateReal final {
 public:
  AttributedString attributedString;
  std::vector<AgentsmithMarkdownTextParagraphStyleRange> paragraphStyleRanges;
  std::vector<AgentsmithMarkdownTextAttachmentRange> attachmentRanges;
};

class AgentsmithMarkdownTextShadowNode final : public ConcreteViewShadowNode<
AgentsmithMarkdownTextComponentName,
AgentsmithMarkdownTextProps,
AgentsmithMarkdownTextEventEmitter,
AgentsmithMarkdownTextStateReal> {
public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  AgentsmithMarkdownTextShadowNode(
   const ShadowNode& sourceShadowNode,
   const ShadowNodeFragment& fragment
  );

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::LeafYogaNode);
    traits.set(ShadowNodeTraits::Trait::MeasurableYogaNode);
    return traits;
  }

  void layout(LayoutContext layoutContext) override;

  Size measureContent(
      const LayoutContext& layoutContext,
      const LayoutConstraints& layoutConstraints) const override;

private:
  mutable AttributedString _attributedString;
  mutable std::vector<AgentsmithMarkdownTextParagraphStyleRange> _paragraphStyleRanges;
  mutable std::vector<AgentsmithMarkdownTextAttachmentRange> _attachmentRanges;
};
} // namespace facebook::React
