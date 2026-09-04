import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, HelperText, Text, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useTranslation } from '@/hooks/useTranslation';
import { TagService } from '@/services/TagService';
import { TagCard } from './components/TagCard';
import { useStyles } from './tag.styles';
import { useViewModel } from './tag.viewModel';

const TagScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const { selectors, handlers } = useViewModel();
  const { pet, tags, scansByTag, isLoading, error } = selectors;

  const renderBody = () => {
    if (isLoading) return <LoadingState />;
    if (!pet) return <EmptyState icon="paw" title={t('tag.noPet')} />;

    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleLarge" style={styles.petName}>
          {t('tag.forPet', { name: pet.name })}
        </Text>

        {error ? <HelperText type="error" visible>{error}</HelperText> : null}

        {tags.length === 0 ? (
          <EmptyState compact icon="tag-outline" title={t('tag.empty')} />
        ) : (
          tags.map((tag) => (
            <TagCard
              key={tag.id}
              tag={tag}
              scans={scansByTag[tag.id] ?? []}
              publicUrl={TagService.publicUrl(tag)}
              onToggleLost={(lost) => handlers.toggleLost(tag, lost)}
              onSaveContact={(phone, note) => handlers.saveContact(tag, phone, note)}
              onDelete={() => handlers.deleteTag(tag.id)}
            />
          ))
        )}

        <Button
          mode="contained"
          icon="tag-plus"
          onPress={handlers.createTag}
          style={{ marginTop: 4 }}
        >
          {t('tag.create')}
        </Button>
      </ScrollView>
    );
  };

  return (
    <BaseScreen edges={['top']} header={false}>
      <ScreenHeader title={t('tag.title')} />
      <View style={{ flex: 1 }}>{renderBody()}</View>
    </BaseScreen>
  );
};

export const TagScreen = TagScreenComp;
